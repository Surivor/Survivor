"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import Header from "@/components/Header";
import Link from "next/link";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = getToken();
                const res = await fetch(`/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || "Impossible de récupérer l'utilisateur");
                }

                const data = await res.json();
                setUserData(data);
            } catch (err: any) {
                setFetchError(err.message);
            } finally {
                setPageLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleValidate = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const token = getToken();
            
            const res = await fetch(`/api/users/${id}/validate`, {
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
            
            setMessage("Le compte a été validé avec succès.");
            if (userData) setUserData({ ...userData, isVerified: true });

            setTimeout(() => {
                router.push("/admin");
            }, 2000);

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
            const res = await fetch(`/api/users/${id}/suspend`, {
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
            
            setMessage("Le compte a été suspendu avec succès.");
            if (userData) setUserData({ ...userData, isVerified: false });

        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?")) return;

        setLoading(true);
        setMessage(null);
        try {
            const token = getToken();
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Erreur lors de la suppression");
            }
            
            setMessage("L'utilisateur a été supprimé avec succès.");
            setTimeout(() => {
                router.push("/admin");
            }, 2000);

        } catch (error: any) {
            setMessage(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Header />
            <main className="flex flex-1 flex-col items-center px-8 py-12">
                <div className="w-full max-w-2xl space-y-8">
                    
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-zinc-500 hover:text-primary">
                            ← Retour
                        </Link>
                        <h1 className="font-title text-3xl font-bold text-primary uppercase">
                            Gérer l'utilisateur #{id}
                        </h1>
                    </div>

                    <div className="rounded-[32px] border-2 border-zinc-200 bg-white p-8 shadow-sm flex flex-col gap-6">
                        {pageLoading ? (
                            <p className="text-zinc-500">Chargement des informations...</p>
                        ) : fetchError ? (
                            <p className="text-red-500">Erreur : {fetchError}</p>
                        ) : userData ? (
                            <div className="flex flex-col gap-4 text-zinc-700">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="font-semibold">Nom :</div>
                                    <div>{userData.name || userData.firstname || 'Non renseigné'}</div>
                                    
                                    <div className="font-semibold">Email :</div>
                                    <div>{userData.email}</div>
                                    
                                    <div className="font-semibold">Statut du compte :</div>
                                    <div>
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                            userData.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {userData.isVerified ? 'Validé' : 'En attente'}
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

                        <div className="grid grid-cols-3 gap-4 mt-6 border-t border-zinc-200 pt-6">
                            <button 
                                onClick={handleDelete} 
                                disabled={loading}
                                className="w-full rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-semibold hover:bg-red-100 transition disabled:opacity-50"
                            >
                                Supprimer
                            </button>
                            <button 
                                onClick={handleSuspend} 
                                disabled={loading || (userData && !userData.isVerified)}
                                className="w-full rounded-xl bg-amber-50 border border-amber-200 text-amber-600 px-4 py-3 font-semibold hover:bg-amber-100 transition disabled:opacity-50"
                            >
                                Suspendre
                            </button>
                            <button 
                                onClick={handleValidate} 
                                disabled={loading || (userData && userData.isVerified)}
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
