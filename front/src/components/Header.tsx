"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getUserRole } from "@/lib/auth";

export default function Header() {
    const [isPartner, setIsPartner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const role = getUserRole();
        
        console.log("Rôle extrait du token :", role);

        if (role && typeof role === 'string') {
            const lowerRole = role.toLowerCase();
            if (lowerRole === "partenaire") {
                setIsPartner(true);
            }
            if (lowerRole === "admin" || lowerRole === "administrateur") {
                setIsAdmin(true);
            }
        } 
    }, []);

    return (
        <header className="w-full bg-white border-b border-zinc-200 px-6 py-3 shadow-sm relative z-50">
            <div className="container mx-auto flex items-center justify-between">
                
                <div className="flex items-center gap-4 sm:gap-8">
                    <Link href="/main" className="flex items-center gap-3 sm:gap-6">
                        <Image
                            src="/bloc_marque_etat.jpeg"
                            alt="République française"
                            width={80}
                            height={30}
                            priority
                            style={{ width: "auto", height: "auto" }}
                        />
                        <div className="hidden sm:block h-6 w-[1px] bg-zinc-300" />
                        <h3 className="text-lg sm:text-xl font-bold font-title text-primary">Ticket Tout</h3>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6 pl-6 border-l border-zinc-200">
                        <Link href="/main" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Accueil
                        </Link>
                        <Link href="/history" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Historique
                        </Link>
                        <Link href="/partner" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Partenaires
                        </Link>
                        
                        {isPartner && (
                            <Link href="/partner-dashboard" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                                Espace partenaire
                            </Link>
                        )}
                        
                        {isAdmin && (
                            <Link href="/admin" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                                Espace admin
                            </Link>
                        )}
                        
                        <Link href="/profile" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Profil
                        </Link>
                    </nav>
                </div>
                
                <button 
                    className="lg:hidden flex items-center p-2 text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
                
            </div>

            {isMenuOpen && (
                <nav className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-md flex flex-col py-4 px-6 gap-4">
                    <Link href="/main" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 hover:text-primary font-medium transition-colors block">
                        Accueil
                    </Link>
                    <Link href="/history" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 hover:text-primary font-medium transition-colors block">
                        Historique
                    </Link>
                    <Link href="/partner" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 hover:text-primary font-medium transition-colors block">
                        Partenaires
                    </Link>
                    
                    {isPartner && (
                        <Link href="/partner-dashboard" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 hover:text-primary font-medium transition-colors block">
                            Espace partenaire
                        </Link>
                    )}
                    
                    {isAdmin && (
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 hover:text-primary font-medium transition-colors block">
                            Espace admin
                        </Link>
                    )}
                    
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-zinc-600 hover:text-primary font-medium transition-colors block">
                        Profil
                    </Link>
                </nav>
            )}
        </header>
    );
}