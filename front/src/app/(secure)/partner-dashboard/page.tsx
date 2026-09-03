"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";
import Header from "@/components/Header";
import SimulationBanner from "@/components/SimulationBanner";

type Transaction = {
  id: number;
  userId: number;
  amount: number;
  partnerId: number;
  createdAt: string;
};

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [qrInput, setQrInput] = useState("");
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await fetch("/api/transactions/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        removeToken();
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch {
    } finally {
      setLoadingHistory(false);
    }
  }

  async function handlePayment() {
    setError(null);
    setSuccess(null);

    if (!qrInput.trim()) {
      setError("Collez le contenu du QR code du salarié.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Entrez un montant valide.");
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/transactions/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          qrCodeToken: qrInput.trim(),
          amount: parseFloat(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Erreur lors du paiement.");
        return;
      }

      setSuccess(
        `Paiement de ${parseFloat(amount).toFixed(2)}€ encaissé. Solde restant du salarié : ${data.remainingBalance}€`
      );
      setQrInput("");
      setAmount("");
      loadHistory();
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setPaying(false);
    }
  }

  const totalEncaisse = history.reduce((sum, t) => sum + parseFloat(t.amount as any), 0);

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4 pt-8">
        <SimulationBanner />

        <div className="w-full max-w-2xl flex flex-col gap-6">

          {/* Encaisser un paiement */}
          <div className="rounded-2xl bg-white border border-zinc-100 shadow-sm p-6 space-y-4">
            <h1 className="text-xl font-bold font-title text-primary">
              Encaisser un paiement
            </h1>
            <p className="text-sm text-zinc-500">
              Le salarié génère un QR code depuis son espace. Scannez-le ou collez son contenu ci-dessous, puis entrez le montant.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Contenu du QR code
                </label>
                <textarea
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="Collez ici le token QR du salarié..."
                  rows={3}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-action focus:ring-1 focus:ring-action resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Montant à encaisser (€)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="ex: 45.00"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-action focus:ring-1 focus:ring-action"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                {success}
              </p>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={paying}
              className="w-full rounded-lg bg-action py-2.5 text-sm font-semibold text-white transition-colors hover:bg-action/90 disabled:opacity-50"
            >
              {paying ? "Traitement en cours..." : "Valider le paiement"}
            </button>
          </div>

          {/* Historique des encaissements */}
          <div className="rounded-2xl bg-white border border-zinc-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-title text-primary">
                Mes encaissements
              </h2>
              <span className="text-sm font-semibold text-action">
                Total : {totalEncaisse.toFixed(2)}€
              </span>
            </div>

            {loadingHistory ? (
              <p className="text-sm text-zinc-400">Chargement...</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-zinc-400">Aucun encaissement pour le moment.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {history.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        Salarié #{t.userId}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {new Date(t.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +{parseFloat(t.amount as any).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}