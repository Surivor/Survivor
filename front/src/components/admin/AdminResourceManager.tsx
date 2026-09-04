"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import Header from "@/components/Header";

type Props = {
    resourceType: "user" | "partner";
};

export default function AdminResourceManager({ resourceType }: Props) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const title = resourceType === "user" ? "Gestion des Utilisateurs" : "Gestion des Partenaires";
    const apiEndpoint = resourceType === "user" ? "/api/admin/users" : "/api/admin/partners";

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        async function fetchData() {
            try {
                const res = await fetch(apiEndpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Erreur lors de la récupération des données.");
                const data = await res.json();
                setItems(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [apiEndpoint]);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Header />
            <main className="flex flex-1 flex-col items-center px-8 py-12">
                <div className="w-full max-w-6xl space-y-8">
                    
                    {/* Titre dynamique */}
                    <div className="flex items-center justify-between">
                        <h1 className="font-title text-3xl font-bold text-primary uppercase">
                            {title}
                        </h1>
                        <span className="rounded-full bg-zinc-200 px-4 py-1 text-sm font-semibold text-zinc-700">
                            Total : {items.length}
                        </span>
                    </div>

                    {/* Tableau des données */}
                    <div className="rounded-[32px] border-2 border-zinc-200 bg-white p-8 shadow-sm">
                        {loading ? (
                            <p className="text-center text-zinc-500 py-8">Chargement en cours...</p>
                        ) : error ? (
                            <p className="text-center text-red-600 py-8">{error}</p>
                        ) : items.length === 0 ? (
                            <p className="text-center text-zinc-400 py-8">Aucun élément trouvé.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-200 text-sm font-semibold text-zinc-500 uppercase">
                                            <th className="py-4 px-4">Nom / Identifiant</th>
                                            <th className="py-4 px-4">Email / Info</th>
                                            <th className="py-4 px-4">Statut</th>
                                            <th className="py-4 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {items.map((item) => (
                                            <tr key={item.id} className="hover:bg-zinc-50 transition">
                                                <td className="py-4 px-4 font-medium text-zinc-900">
                                                    {item.name || item.objet_social || `ID #${item.id}`}
                                                </td>
                                                <td className="py-4 px-4 text-zinc-600">
                                                    {item.email || `SIREN: ${item.siren || 'N/A'}`}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                                        item.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {item.isVerified ? 'Actif / Validé' : 'En attente'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    {/* Boutons d'actions contextuels */}
                                                    <button className="rounded-xl bg-action px-4 py-2 text-xs font-semibold text-white hover:bg-action/90 transition">
                                                        Gérer
                                                    </button>
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