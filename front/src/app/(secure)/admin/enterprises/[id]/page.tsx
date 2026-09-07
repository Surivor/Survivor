"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import Header from "@/components/Header";
import Link from "next/link";

export default function EnterpriseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [enterpriseData, setEnterpriseData] = useState<any>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEnterprise = async () => {
            try {
                const token = getToken();
                const res = await fetch(`/api/enterprises/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        router.push("/admin/enterprises");
                        return;
                    }
                    const errText = await res.text();
                    throw new Error(errText || "Impossible de récupérer l'entreprise");
                }

                const data = await res.json();
                setEnterpriseData(data);
            } catch (err: any) {
                setFetchError(err.message);
            } finally {
                setPageLoading(false);
            }
        };

        fetchEnterprise();
    }, [id, router]);

    const handleValidate = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const token = getToken();
            
            const res = await fetch(`/api/enterprises/${id}/validate`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Erreur lors de la validation");
            }
            
            setMessage("Le compte entreprise a été validé avec succès.");
            if (enterpriseData) {
                setEnterpriseData({
                    ...enterpriseData,
                    user: { ...enterpriseData.user, isVerified: true }
                });
            }

        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const token = getToken();
            const res = await fetch(`/api/enterprises/${id}/suspend`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Erreur lors de la suspension");
            }
            
            setMessage("Le compte entreprise a été suspendu avec succès.");
            if (enterpriseData) {
                setEnterpriseData({
                    ...enterpriseData,
                    user: { ...enterpriseData.user, isVerified: false }
                });
            }

        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette entreprise ?")) return;

        setLoading(true);
        setMessage(null);
        try {
            const token = getToken();
            const res = await fetch(`/api/enterprises/${id}`, {
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Erreur lors de la suppression");
            }
            
            setMessage("L'entreprise a été supprimée avec succès.");
            router.push("/admin/enterprises");

        } catch (error: any) {
            setMessage(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Header />
            <main className="flex flex-1 flex-col items-center px-4 md:px-8 py-8 md:py-12">
                <div className="w-full max-w-2xl space-y-6 md:space-y-8">
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <Link href="/admin/enterprises" className="text-zinc-500 hover:text-primary">
                            ← Retour
                        </Link>
                        <h1 className="font-title text-2xl md:text-3xl font-bold text-primary uppercase">
                            Gérer l'entreprise SIRH #{id}
                        </h1>
                    </div>

                    <div className="rounded-[24px] md:rounded-[32px] border-2 border-zinc-200 bg-white p-4 md:p-8 shadow-sm flex flex-col gap-6">
                        {pageLoading ? (
                            <p className="text-zinc-500">Chargement des informations...</p>
                        ) : fetchError ? (
                            <p className="text-red-500">Erreur : {fetchError}</p>
                        ) : enterpriseData ? (
                            <div className="flex flex-col gap-4 text-zinc-700">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                    <div className="font-semibold">Nom de l'entreprise :</div>
                                    <div className="mb-2 sm:mb-0">{enterpriseData.user?.name || 'Non renseigné'}</div>
                                    
                                    <div className="font-semibold">Email de contact :</div>
                                    <div className="mb-2 sm:mb-0 break-all">{enterpriseData.user?.email}</div>
                                    
                                    <div className="font-semibold">SIREN :</div>
                                    <div className="mb-2 sm:mb-0 break-all">{enterpriseData.siren}</div>
                                    
                                    <div className="font-semibold">Clé API SIRH :</div>
                                    <div className="mb-2 sm:mb-0 font-mono text-xs bg-zinc-100 p-2 rounded break-all">{enterpriseData.apiKey}</div>
                                    
                                    <div className="font-semibold">Statut du compte :</div>
                                    <div>
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                            enterpriseData.user?.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {enterpriseData.user?.isVerified ? 'Validé' : 'En attente'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {message && (
                            <div className={`p-4 rounded-xl font-semibold ${message.includes("succès") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 border-t border-zinc-200 pt-6">
                            <button 
                                onClick={handleDelete} 
                                disabled={loading}
                                className="w-full rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-semibold hover:bg-red-100 transition disabled:opacity-50"
                            >
                                Supprimer
                            </button>
                            <button 
                                onClick={handleSuspend} 
                                disabled={loading || (enterpriseData && !enterpriseData.user?.isVerified)}
                                className="w-full rounded-xl bg-amber-50 border border-amber-200 text-amber-600 px-4 py-3 font-semibold hover:bg-amber-100 transition disabled:opacity-50"
                            >
                                Suspendre
                            </button>
                            <button 
                                onClick={handleValidate} 
                                disabled={loading || (enterpriseData && enterpriseData.user?.isVerified)}
                                className="w-full rounded-xl bg-action px-4 py-3 font-semibold text-white hover:bg-action/90 transition disabled:opacity-50 shadow-sm"
                            >
                                {loading ? "Action..." : "Valider"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
