"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";
import Header from "@/components/Header";
import HistoryMain from "@/components/History_main";

type Transaction = {
    name?: string;
    date?: string;
    amount?: string | number;
};

export default function HistoryPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push("/login");
            return;
        }

        async function loadHistory() {
            try {
                const res = await fetch("http://localhost:3000/api/transactions/history", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 401) {
                    removeToken();
                    router.push("/login");
                    return;
                }

                if (!res.ok) {
                    throw new Error("Impossible de récupérer l'historique.");
                }

                const data = await res.json();
                setTransactions(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, [router]);

    return (
        <>
            <Header />
            <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4 pt-8">
                <div className="w-full max-w-3xl">
                    <h1 className="font-title text-2xl font-bold text-primary mb-6">Historique de paiements</h1>
                    
                    {loading ? (
                        <p className="text-sm text-zinc-500">Chargement de l'historique...</p>
                    ) : error ? (
                        <p className="text-sm text-red-600">{error}</p>
                    ) : (
                        <HistoryMain transactions={transactions} />
                    )}
                </div>
            </div>
        </>
    );
}