"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const role = getUserRole();
        console.log(role);
        
        if (role !== "admin") {
            router.push("/main");
        } else {
            setIsAdmin(true);
        }
    }, [router]);

    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <p className="font-title font-bold text-primary">Vérification des droits administrateur...</p>
            </div>
        );
    }

    return <>{children}</>;
}