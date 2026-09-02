import Link from "next/link";
import { FormEvent } from 'react'
import Header from "@/components/Header";

export default function mainPage() {
    return (
        <>
        <Header />
        <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4">
            <h1 className="font-title text-2xl font-bold text-primary">Historique de paiements</h1>
        </div>
        </>
    );
}