import Link from 'next/link'

const partners = [
    { name: "Boulangerie du Marché", category: "Alimentation", distance: "150 m" },
    { name: "Restaurant Le Bistrot", category: "Restauration", distance: "320 m" },
    { name: "Épicerie Bio Verde", category: "Alimentation", distance: "480 m" },
    { name: "Pharmacie Centrale", category: "Santé", distance: "1,2 km" },
]

export default function Partener_main() {
    return (
        <div className="w-full rounded-[28px] bg-white border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-black font-bold text-xl">Près de chez vous</h2>
                <Link href="/partner" className="text-blue-600 text-sm font-medium hover:underline">
                    Voir tout
                </Link>
            </div>

            <div className="divide-y divide-gray-100">
                {partners.map((p) => (
                    <div key={p.name} className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-black font-semibold">{p.name}</p>
                            <p className="text-gray-400 text-sm">{p.category}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-lg">
              {p.distance}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
}