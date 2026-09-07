"use client";

import Link from "next/link";

interface FeaturedPartnerCardProps {
    partner: {
        id: number;
        siren: number;
        objet_social: string;
        user?: {
            name: string;
        };
    };
}

export default function FeaturedPartnerCard({ partner }: FeaturedPartnerCardProps) {
    if (!partner) return null;

    return (
        <div className="w-full bg-white rounded-3xl border-2 border-primary shadow-sm overflow-hidden flex flex-col mt-2 mb-2">
            {/* Top banner / Label */}
            <div className="bg-primary text-white py-3 px-6 flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-400" fill="currentColor" stroke="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <h3 className="font-title font-bold text-lg md:text-xl uppercase tracking-wide mt-1">
                    Coup de cœur du Ministère du Bonheur
                </h3>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h4 className="font-title text-2xl font-bold text-zinc-900 uppercase">
                            {partner.user?.name || "Partenaire sans nom"}
                        </h4>
                        <span className="inline-block mt-2 bg-blue-50 border border-blue-200 text-primary text-xs font-bold uppercase px-3 py-1 rounded-full">
                            Partenaire officiel
                        </span>
                    </div>
                </div>
                
                <p className="text-zinc-600 leading-relaxed max-w-3xl">
                    {partner.objet_social || "Aucune description fournie pour ce partenaire."}
                </p>
                
                <div className="mt-4">
                    <Link 
                        href={`/partner`} 
                        className="inline-flex items-center gap-2 font-bold text-primary hover:text-action transition-colors"
                    >
                        Découvrir ce partenaire
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
