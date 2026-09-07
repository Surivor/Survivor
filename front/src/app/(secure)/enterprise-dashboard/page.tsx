"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";
import Header from "@/components/Header";

type EnterpriseInfo = {
    id: number;
    siren: number;
    apiKey: string;
};

type EmployeeData = {
    id: number;
    name: string;
    firstname: string;
    email: string;
    isVerified: boolean;
    balance: number;
};

type SirhResponse = {
    enterpriseSiren: number;
    totalEmployees: number;
    employees: EmployeeData[];
};

export default function EnterpriseDashboardPage() {
    const router = useRouter();
    const token = getToken();
    const [enterprise, setEnterprise] = useState<EnterpriseInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sirhData, setSirhData] = useState<SirhResponse | null>(null);
    const [loadingApi, setLoadingApi] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }
        
        async function loadEnterprise() {
            try {
                const resMe = await fetch("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (!resMe.ok) {
                    if (resMe.status === 401) {
                        removeToken();
                        router.push("/login");
                        return;
                    }
                    throw new Error("Impossible de charger votre profil");
                }
                
                const user = await resMe.json();
                
                if (user.status !== 'entreprise-SIRH') {
                    router.push("/main");
                    return;
                }

                const resEnt = await fetch(`/api/enterprises/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!resEnt.ok) {
                    throw new Error("Impossible de charger les données de l'entreprise");
                }

                const entData = await resEnt.json();
                setEnterprise(entData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        
        loadEnterprise();
    }, [router, token]);

    const handleCopy = () => {
        if (!enterprise?.apiKey) return;
        navigator.clipboard.writeText(enterprise.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const testApi = async () => {
        if (!enterprise?.apiKey) return;
        
        setLoadingApi(true);
        setApiError(null);
        
        try {
            const res = await fetch("/api/sirh/employees", {
                headers: {
                    "x-api-key": enterprise.apiKey
                }
            });

            if (!res.ok) {
                throw new Error("Erreur de connexion (Clé API invalide ou serveur injoignable)");
            }

            const data = await res.json();
            setSirhData(data);
        } catch (err: any) {
            setApiError(err.message);
        } finally {
            setLoadingApi(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-primary"></div>
            </div>
        );
    }

    if (error || !enterprise) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <p className="text-zinc-500">{error || "Impossible de charger les données"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            <Header />
            
            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                {/* En-tête de page discret */}
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 font-title">Intégration SIRH</h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        Gérez vos clés d'API et consultez les données de vos salariés affiliés.
                    </p>
                </div>

                {/* Section API & Credentials */}
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    <div className="border-b border-zinc-200 px-6 py-5">
                        <h3 className="text-base font-medium text-zinc-900">Identifiants de connexion</h3>
                    </div>
                    
                    <div className="px-6 py-6 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-8">
                            <div className="w-full sm:w-1/3">
                                <label className="block text-sm font-medium text-zinc-700 mb-1">SIREN Entreprise</label>
                                <div className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 font-mono">
                                    {enterprise.siren}
                                </div>
                            </div>

                            <div className="w-full sm:w-2/3">
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Clé API (x-api-key)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="password" 
                                        value={enterprise.apiKey} 
                                        readOnly 
                                        className="block w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm font-mono text-zinc-800 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="shrink-0 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {copied ? "Copié !" : "Copier"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Documentation */}
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    <div className="border-b border-zinc-200 px-6 py-5">
                        <h3 className="text-base font-medium text-zinc-900">Exemple de requête</h3>
                    </div>
                    <div className="px-6 py-6">
                        <div className="rounded-lg bg-zinc-900 p-4 overflow-x-auto">
                            <pre className="text-sm font-mono leading-relaxed">
                                <span className="text-pink-400">curl</span> <span className="text-zinc-300">-X GET \</span><br/>
                                <span className="text-zinc-300">  /api/sirh/employees \</span><br/>
                                <span className="text-zinc-300">  -H </span><span className="text-emerald-400">'x-api-key: {enterprise.apiKey.substring(0, 15)}...'</span>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Section Test Live */}
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    <div className="border-b border-zinc-200 px-6 py-5 flex items-center justify-between">
                        <h3 className="text-base font-medium text-zinc-900">Console de test</h3>
                        <button 
                            onClick={testApi}
                            disabled={loadingApi}
                            className="inline-flex items-center justify-center rounded-lg bg-action px-4 py-2 text-sm font-medium text-white hover:bg-action/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingApi ? "Exécution..." : "Exécuter la requête"}
                        </button>
                    </div>
                    
                    <div className="px-6 py-6">
                        {apiError && (
                            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                                {apiError}
                            </div>
                        )}

                        {!sirhData && !apiError && (
                            <div className="text-center py-8 text-sm text-zinc-400">
                                Cliquez sur "Exécuter la requête" pour visualiser les données de vos salariés.
                            </div>
                        )}

                        {sirhData && (
                            <div className="animate-in fade-in duration-500">
                                <div className="mb-6 flex gap-8">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total salariés</p>
                                        <p className="mt-1 text-2xl font-semibold text-zinc-900">{sirhData.totalEmployees}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Statut</p>
                                        <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                            Connecté
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-zinc-200">
                                    <table className="min-w-full divide-y divide-zinc-200">
                                        <thead className="bg-zinc-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zinc-500">ID</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Employé</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Email</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Statut</th>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Solde</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 bg-white">
                                            {sirhData.employees.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                                                        Aucun salarié trouvé.
                                                    </td>
                                                </tr>
                                            ) : (
                                                sirhData.employees.map((emp) => (
                                                    <tr key={emp.id} className="hover:bg-zinc-50 transition-colors">
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500 font-mono">
                                                            {emp.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900">
                                                            {emp.firstname} {emp.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                                                            {emp.email}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                                emp.isVerified 
                                                                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                                                                    : 'bg-zinc-50 text-zinc-600 ring-zinc-500/20'
                                                            }`}>
                                                                {emp.isVerified ? 'Actif' : 'En attente'}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900 text-right">
                                                            {emp.balance.toFixed(2)} €
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}