"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import BalanceCard from "@/components/BalanceCard";
import QrCodeCard from "@/components/QrCodeCard";
import Header from "@/components/Header";
import HistoryMain from "@/components/History_main";
import Partener_main from "@/components/Partener_main";
import FeaturedPartnerCard from "@/components/FeaturedPartnerCard";

export default function MainPage() {
    const [balance, setBalance] = useState({ available: 0, used: 0, limit: 300 });
    const [transactions, setTransactions] = useState([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        const fetchDashboardData = async () => {
            const headers = { Authorization: `Bearer ${token}` };

            const safeJson = async (res: Response) => {
                const text = await res.text();
                return text ? JSON.parse(text) : null;
            };

            try {
                const [balanceRes, historyRes, partnersRes] = await Promise.all([
                    fetch("/api/transactions/balance", { headers }),
                    fetch("/api/transactions/history", { headers }),
                    fetch("/api/partners/verified", { headers })
                ]);

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

                if (historyRes.ok) {
                    const hData = await safeJson(historyRes);
                    if (hData) setTransactions(Array.isArray(hData) ? hData : []);
                }

                if (partnersRes.ok) {
                    const pData = await safeJson(partnersRes);
                    if (pData) setPartners(Array.isArray(pData) ? pData : []);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des données :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const featuredPartner = partners.find(p => p.featured === true);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <p className="text-[#1B3A6B] font-bold">Chargement de votre espace...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4 pt-8">
                <div className="w-full max-w-5xl flex flex-col items-center gap-8">
                    <BalanceCard balance={balance.available} used={balance.used} limit={balance.limit} />
                    <QrCodeCard />
                    {featuredPartner && <FeaturedPartnerCard partner={featuredPartner} />}
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-2.5 w-full">
                        <HistoryMain transactions={transactions} />
                        <Partener_main partners={partners} />
                    </div>
                </div>
            </div>
        </>
    );
}