"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getUserRole } from "@/lib/auth";

export default function Header() {
    const [isPartner, setIsPartner] = useState(false);

    useEffect(() => {
        const role = getUserRole();
        
        console.log("Rôle extrait du token :", role);

        if (role && typeof role === 'string' && role.toLowerCase() === "partenaire") {
            setIsPartner(true);
        } 
    }, []);

    return (
        <header className="w-full bg-white border-b border-zinc-200 px-6 py-3 shadow-sm">
            <div className="container mx-auto flex items-center justify-between">
                
                <div className="flex items-center gap-8">
                    <Link href="/main" className="flex items-center gap-6">
                        <Image
                            src="/bloc_marque_etat.jpeg"
                            alt="République française"
                            width={80}
                            height={30}
                            priority
                            style={{ width: "auto", height: "auto" }}
                        />
                        <div className="h-6 w-[1px] bg-zinc-300" />
                        <h3 className="text-xl font-bold font-title text-primary">Ticket Tout</h3>
                    </Link>

                    <nav className="flex items-center gap-6 pl-6 border-l border-zinc-200">
                        <Link href="/main" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Accueil
                        </Link>
                        <Link href="/history" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Historique
                        </Link>
                        <Link href="/partner" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Partenaires
                        </Link>
                        
                        { }
                        {isPartner && (
                            <Link href="/partner-dashboard" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                                Espace partenaire
                            </Link>
                        )}
                        
                        <Link href="/profile" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Profil
                        </Link>
                    </nav>
                </div>
                
                <div />
                
            </div>
        </header>
    );
}