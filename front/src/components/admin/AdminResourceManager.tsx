"use client";

import Header from "@/components/Header";
import AdminUsersList from "@/components/AdminUsersList";

type Props = {
    resourceType: "user" | "partner";
};

export default function AdminResourceManager({ resourceType }: Props) {
    const title = resourceType === "user" ? "Gestion des Utilisateurs" : "Gestion des Partenaires";

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Header />
            <main className="flex flex-1 flex-col items-center px-4 md:px-8 py-8 md:py-12">
                <div className="w-full max-w-6xl space-y-6 md:space-y-8">
                    
                    {/* Titre dynamique */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h1 className="font-title text-2xl md:text-3xl font-bold text-primary uppercase">
                            {title}
                        </h1>
                    </div>

                    <AdminUsersList resourceType={resourceType} />
                </div>
            </main>
        </div>
    );
}