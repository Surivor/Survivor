"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";
import BalanceCard from "@/components/BalanceCard";
import Header from "@/components/Header";

type UserProfile = {
  id: number;
  name: string;
  firstname: string;
  email: string;
  status: string;
};

type BalanceState = {
  available: number;
  used: number;
  limit: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<BalanceState>({ available: 0, used: 0, limit: 300 });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const safeJson = async (res: Response) => {
          const text = await res.text();
          return text ? JSON.parse(text) : null;
        };

        const [meRes, balanceRes] = await Promise.all([
          fetch("http://localhost:3000/api/users/me", { headers }),
          fetch("http://localhost:3000/api/transactions/balance", { headers }),
        ]);

        if (meRes.status === 401 || balanceRes.status === 401) {
          removeToken();
          router.push("/login");
          return;
        }

        if (!meRes.ok) {
          throw new Error("Impossible de charger le profil");
        }

        const meData = await safeJson(meRes);
        if (meData) setUser(meData);

        if (balanceRes.ok) {
          const bData = await safeJson(balanceRes);
          if (bData) {
            setBalance({
              available: bData.balance || 0,
              used: 300 - (bData.balance || 0),
              limit: 300
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-primary">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <p className="text-sm text-red-600">{error ?? "Profil introuvable"}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4 pt-8">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-7 shadow-md space-y-6">
          <div>
            <h1 className="text-2xl font-bold font-title text-primary mb-4">Mon profil</h1>

            <div className="space-y-2 text-sm text-zinc-900">
              <p><span className="font-semibold">Nom :</span> {user.name}</p>
              <p><span className="font-semibold">Prénom :</span> {user.firstname}</p>
              <p><span className="font-semibold">Email :</span> {user.email}</p>
            </div>
          </div>

          <BalanceCard balance={balance.available} used={balance.used} limit={balance.limit} />
        </div>
      </div>
    </>
  );
}