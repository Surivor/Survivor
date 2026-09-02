import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full bg-zinc-50 p-10">
            <nav className="container mx-auto flex gap-10">
                <h3 className="text-2xl font-bold text-blue-600">CartePro</h3>
                <Link href="/main" className="text-zinc-900 hover:text-zinc-700 underline zoom-125">Acceuil</Link>
                <Link href="/history" className="text-zinc-900 hover:text-zinc-700 underline zoom-125">historique</Link>
                <Link href="/partner" className="text-zinc-900 hover:text-zinc-700 underline zoom-125">Partenaire</Link>
            </nav>
        </header>
    );
}
