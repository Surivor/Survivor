import Link from 'next/link'

const transactions = [
    { name: "Boulangerie du Marché", date: "1 sept. 2026", amount: "-8,50 €" },
    { name: "Restaurant Le Bistrot", date: "30 août 2026", amount: "-14,20 €" },
    { name: "Pharmacie Centrale", date: "29 août 2026", amount: "-22,00 €" },
    { name: "Librairie Pages & Co", date: "28 août 2026", amount: "-18,90 €" },
]

export default function HistoryMain() {
    return (
        <div className={"w-full rounded-[28px] bg-white border border-gray-100 shadow-sm p-6"}>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-black font-bold text-xl">Dernières transactions</h2>
                <Link href="/history" className="text-blue-600 text-sm font-medium hover:underline">
                    Voir tout
                </Link>
            </div>

            <div className="divide-y divide-gray-100">
                {transactions.map((t) => (
                    <div key={t.name} className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-black font-semibold">{t.name}</p>
                            <p className="text-gray-400 text-sm">{t.date}</p>
                        </div>
                        <span className="text-red-500 font-semibold">{t.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}