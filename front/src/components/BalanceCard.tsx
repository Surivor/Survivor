import { useState, useEffect, useRef } from "react";
import SimulationBanner from "./SimulationBanner";

type BalanceCardProps = {
  balance: number;
};

export default function BalanceCard({ balance }: BalanceCardProps) {
  const [displayedBalance, setDisplayedBalance] = useState(balance);
  const displayedBalanceRef = useRef(balance);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500;
    const startValue = displayedBalanceRef.current;
    const endValue = balance;
    let animationFrameId: number;

    if (startValue === endValue) {
        setDisplayedBalance(balance);
        displayedBalanceRef.current = balance;
        return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeProgress;
      
      setDisplayedBalance(currentValue);
      displayedBalanceRef.current = currentValue;

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayedBalance(endValue);
        displayedBalanceRef.current = endValue;
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [balance]);

  const limit = 150;
  const isNegative = displayedBalance < 0;
  const used = isNegative ? Math.abs(displayedBalance) : 0;
  const targetUsed = balance < 0 ? Math.abs(balance) : 0;
  const percentage = balance < 0 ? (targetUsed / limit) * 100 : 0;

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
        <h2 className="mb-8 text-[3.4rem] font-bold font-title tabular-nums tracking-tight">
          {formatEuro(displayedBalance)}
        </h2>

        {isNegative && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[15px] text-white/90">Avance Ticket Tout utilisée</p>
              <p className="text-[15px] text-white/90 tabular-nums">
                {formatEuro(used)} / {limit} €
              </p>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-accent-cyan transition-all duration-1000 ease-out"
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