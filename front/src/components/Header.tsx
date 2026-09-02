import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full bg-zinc-50 px-6 py-6">
            <nav className="container mx-auto flex items-center gap-10">
                <h3 className="font-title text-2xl font-bold text-primary">Ticket Tout</h3>
                <Link href="/main" className="text-zinc-900 hover:text-zinc-700 underline zoom-125">Acceuil</Link>
                <Link href="/history" className="text-zinc-900 hover:text-zinc-700 underline zoom-125">historique</Link>
                <Link href="/partner" className="text-zinc-900 hover:text-zinc-700 underline zoom-125">Partenaire</Link>
            </nav>
        </header>
    );
}
