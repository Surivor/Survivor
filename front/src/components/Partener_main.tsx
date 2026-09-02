import Link from 'next/link'

type Partner = {
    id: number;
    siren: number;
    objet_social: string;
};

export default function Partener_main({ partners }: { partners?: Partner[] }) {
    const list = partners ?? [];

    return (
        <div className="w-full rounded-[28px] bg-white border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-black font-bold text-xl">Partenaires</h2>
            </div>

            <div className="divide-y divide-gray-100">
                {list.length === 0 && (
                    <p className="text-gray-400 text-sm py-4">Aucun partenaire à afficher.</p>
                )}
                {list.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-black font-semibold">{p.objet_social}</p>
                            <p className="text-gray-400 text-sm">SIREN : {p.siren}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}