"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

export default function Header() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleLogout() {
        removeToken();
        setMenuOpen(false);
        router.push("/");
    }

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
                        <Link href="/profile" className="text-zinc-600 hover:text-primary font-medium transition-colors">
                            Profil
                        </Link>
                    </nav>
                </div>
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Menu du compte"
                        aria-expanded={menuOpen}
                        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-zinc-200 transition-colors hover:border-action"
                    >
                        <Image src="/ticket_tout.png" alt="" width={100} height={100} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-md">
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                                Se déconnecter
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}