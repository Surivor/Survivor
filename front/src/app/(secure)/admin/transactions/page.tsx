"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import Header from "@/components/Header";
import Link from "next/link";

interface Transaction {
    id: number;
    amount: string;
    createdAt: string;
    type: string;
    user: {
        id: number;
        name: string;
        firstname: string;
        email: string;
    } | null;
    partner: {
        id: number;
        name: string;
    } | null;
}

export default function AdminTransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = getToken();
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch("/api/transactions/admin/all", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || "Impossible de récupérer les transactions");
                }

                const data = await res.json();
                setTransactions(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [router]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Header />
            <main className="flex flex-1 flex-col items-center px-4 md:px-8 py-8 md:py-12">
                <div className="w-full max-w-6xl space-y-6 md:space-y-8">
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <Link href="/admin" className="text-zinc-500 hover:text-primary">
                            ← Retour
                        </Link>
                        <h1 className="font-title text-2xl md:text-3xl font-bold text-primary uppercase">
                            Toutes les Transactions
                        </h1>
                    </div>

                    <div className="rounded-[24px] md:rounded-[32px] border-2 border-zinc-200 bg-white p-4 md:p-8 shadow-sm flex flex-col gap-6">
                        {loading ? (
                            <p className="text-zinc-500 text-center py-8">Chargement des transactions...</p>
                        ) : error ? (
                            <p className="text-red-500 text-center py-8">Erreur : {error}</p>
                        ) : transactions.length === 0 ? (
                            <p className="text-zinc-500 text-center py-8">Aucune transaction trouvée.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-zinc-700">
                                    <thead className="bg-zinc-100 text-zinc-600 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 rounded-tl-xl">ID</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Montant</th>
                                            <th className="px-4 py-3">Salarié</th>
                                            <th className="px-4 py-3 rounded-tr-xl">Partenaire</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {transactions.map((t) => (
                                            <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-4 py-4 font-medium">#{t.id}</td>
                                                <td className="px-4 py-4">{formatDate(t.createdAt)}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                                        t.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {t.type === 'credit' ? 'Crédit' : 'Débit'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 font-semibold">
                                                    {Number(t.amount).toFixed(2)} €
                                                </td>
                                                <td className="px-4 py-4">
                                                    {t.user ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">{t.user.firstname} {t.user.name}</span>
                                                            <span className="text-xs text-zinc-400">{t.user.email}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-zinc-400 italic">Inconnu</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {t.partner ? (
                                                        <span className="font-semibold">{t.partner.name}</span>
                                                    ) : (
                                                        <span className="text-zinc-400 italic">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
