export default function BalanceCard() {
  const used = 51.7;
  const limit = 300.0;
  const balance = 248.3;
  const percentage = (used / limit) * 100;

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + " €";

  return (
    <div className="w-full rounded-[28px] bg-[#0C4DDB] p-6 text-white shadow-[0_18px_30px_rgba(16,52,145,0.18)] sm:p-8">
      <p className="mb-3 text-[16px] font-normal text-white/90">Solde disponible</p>
      <h2 className="mb-8 text-[3.4rem] font-semibold leading-none tracking-[-0.06em]">
        {formatEuro(balance).replace(" €", " €")}
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] text-white/90">Utilisé ce mois</p>
          <p className="text-[15px] text-white/90">{formatEuro(used).replace(" €", " €")} / {formatEuro(limit).replace(" €", " €")}</p>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white/80 transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
