import Link from 'next/link';

type Transaction = {
    id: number;
    type: 'credit' | 'debit';
    amount: number;
    createdAt: string;
    partner?: { name: string };
    balanceAfter: number;
};

export default function HistoryMain({ transactions = [] }: { transactions: Transaction[] }) {
    const formatEuro = (value: number) =>
        new Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value) + " €";

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <>
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
                {transactions.map((t) => {
                    const isDebit = t.type === 'debit';
                    const amountNum = Number(t.amount);
                    const previousBalance = isDebit ? t.balanceAfter + amountNum : t.balanceAfter - amountNum;
                    const entersOverdraft = previousBalance >= 0 && t.balanceAfter < 0;
                    
                    return (
                        <div key={t.id} className="flex flex-col py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-black font-semibold">
                                        {isDebit ? (t.partner?.name || 'Paiement') : 'Abondement'}
                                    </p>
                                    <p className="text-gray-400 text-sm">{formatDate(t.createdAt)}</p>
                                </div>
                                <span className={`font-semibold ${isDebit ? 'text-black' : 'text-green-600'}`}>
                                    {isDebit ? '-' : '+'}{formatEuro(amountNum)}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">
                                Solde après opération : {formatEuro(t.balanceAfter)}
                            </p>
                            {entersOverdraft && (
                                <p className="text-sm font-semibold text-accent-cyan mt-1">
                                    Début de votre avance Ticket Tout
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
        </>
    );
}