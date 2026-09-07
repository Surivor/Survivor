import Link from "next/link";
import { FormEvent } from 'react'
import Header from "@/components/Header";
import Partener_main from "@/components/Partener_main";

async function GetParteners() {
    const apiUrl = process.env.API_URL || "http://backend:3000";
    
    const result = await fetch(`${apiUrl}/api/partners/verified`, {
        cache: "no-cache"
    });
    if (!result.ok)
        throw new Error("Failed to fetch partners");
    return result.json();
}

export default async function mainPage() {
    const partners = await GetParteners();

    return (
        <>
        <Header />
        <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4">
            <h1 className="font-title text-2xl font-bold text-primary">Partenaires</h1>
            <Partener_main partners={partners} />
        </div>
        </>
    );
}