import SimulationBanner from "./SimulationBanner";

type BalanceCardProps = {
  balance: number;
};

export default function BalanceCard({ balance }: BalanceCardProps) {
  const limit = 150;
  const isNegative = balance < 0;
  const used = isNegative ? Math.abs(balance) : 0;
  const percentage = isNegative ? (used / limit) * 100 : 0;

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + " €";

  return (
    <>
      <div className="w-full rounded-[28px] bg-primary p-6 text-white shadow-md sm:p-8">
        <p className="mb-3 text-[16px] font-normal text-white/90">
          {isNegative ? "Solde Ticket Tout" : "Solde disponible"}
        </p>
        <h2 className="mb-8 text-[3.4rem] font-bold font-title">
          {formatEuro(balance).replace(" €", " €")}
        </h2>

        {isNegative && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[15px] text-white/90">Avance Ticket Tout utilisée</p>
              <p className="text-[15px] text-white/90">
                {used} € / {limit} €
              </p>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-accent-cyan transition-all duration-300"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            {percentage >= 100 && (
              <p className="text-sm font-semibold text-accent-cyan mt-2">
                Avance maximale utilisée
              </p>
            )}
          </div>
        )}
      </div>
      <SimulationBanner />
    </>
  );
}