import Link from 'next/link';

type Transaction = {
    name?: string;
    date?: string; 
    amount?: string | number;
};

export default function HistoryMain({ transactions = [] }: { transactions: Transaction[] }) {
    return (
        <div className="w-full rounded-[28px] bg-white border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-black font-bold font-title text-xl">Dernières transactions</h2>
                <Link href="/history" className="text-action text-sm font-medium hover:underline">
                    Voir tout
                </Link>
            </div>

            <div className="divide-y divide-gray-100">
                {transactions.length === 0 && (
                    <p className="text-gray-400 text-sm py-4">Aucune transaction.</p>
                )}
                {transactions.map((t, index) => (
                    <div key={index} className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-black font-semibold">{t.name || 'Paiement'}</p>
                            <p className="text-gray-400 text-sm">{t.date}</p>
                        </div>
                        <span className="text-red-500 font-semibold">{t.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}