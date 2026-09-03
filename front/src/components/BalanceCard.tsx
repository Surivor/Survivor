import SimulationBanner from "./SimulationBanner";

type BalanceCardProps = {
  balance: number;
  used: number;
  limit: number;
};

export default function BalanceCard({ balance, used, limit }: BalanceCardProps) {
  const percentage = (used / limit) * 100;

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + " €";

  return (
    <>
      <div className="w-full rounded-[28px] bg-primary p-6 text-white shadow-md sm:p-8">
        <p className="mb-3 text-[16px] font-normal text-white/90">Solde disponible</p>
        <h2 className="mb-8 text-[3.4rem] font-bold font-title">
          {formatEuro(balance).replace(" €", " €")}
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[15px] text-white/90">Utilisé ce mois</p>
            <p className="text-[15px] text-white/90">{formatEuro(used)} / {formatEuro(limit)}</p>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-accent-cyan transition-all duration-300"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
      {}
      <SimulationBanner />
    </>
  );
}