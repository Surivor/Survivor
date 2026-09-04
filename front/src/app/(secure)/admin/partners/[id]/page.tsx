"use client";

import { use } from "react";
import Header from "@/components/Header";
import Link from "next/link";

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    
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
                            Gérer le partenaire #{id}
                        </h1>
                    </div>

                    <div className="rounded-[32px] border-2 border-zinc-200 bg-white p-8 shadow-sm flex flex-col gap-6">
                        <p className="text-zinc-600">
                            Page de gestion spécifique au partenaire à venir...
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
