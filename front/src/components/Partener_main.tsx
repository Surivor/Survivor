"use client";

import { useState } from 'react';
import Link from 'next/link';

type Partner = {
    id: number;
    siren: number;
    objet_social: string;
    user?: {
        name: string;
    };
};

export default function Partener_main({ partners }: { partners?: Partner[] }) {
    const list = partners ?? [];
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPartners = list.filter(partner => {
        const name = partner.user?.name?.toLowerCase() || "";
        const objetSocial = partner.objet_social?.toLowerCase() || "";
        const siren = partner.siren?.toString() || "";
        const query = searchQuery.toLowerCase();
        
        return name.includes(query) || objetSocial.includes(query) || siren.includes(query);
    });

    return (
        <div className="w-full max-w-4xl rounded-[28px] bg-white border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-black font-bold text-2xl font-title uppercase">Nos Partenaires</h2>
                <div className="w-full sm:w-72 relative">
                    <input
                        type="text"
                        placeholder="Rechercher (Nom, SIREN...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-zinc-300 pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    <svg 
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {filteredPartners.length === 0 && (
                    <p className="text-gray-400 text-sm py-8 text-center">Aucun partenaire ne correspond à votre recherche.</p>
                )}
                {filteredPartners.map((p) => (
                    <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-2 hover:bg-zinc-50 transition-colors px-2 rounded-xl">
                        <div>
                            <p className="text-primary font-bold text-lg">{p.user?.name || "Partenaire"}</p>
                            <p className="text-zinc-600 text-sm mt-1">{p.objet_social}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 border border-zinc-200">
                                SIREN : {p.siren}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}