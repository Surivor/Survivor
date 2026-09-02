export default function BalanceCard() {
  const used = 150;
  const limit = 300.00;
  const balance = limit - used;
  const percentage = (used / limit) * 100;

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-primary p-7 text-white">
      <p className="text-sm opacity-90 mb-2">Solde disponible</p>
      <h2 className="text-5xl font-bold mb-6">{balance.toFixed(2)}</h2>
      
      <div className="space-y-3">
        <p className="text-sm opacity-90">Utilisé ce mois</p>
        
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-sm text-right opacity-90">
          {used.toFixed(2)} € / {limit.toFixed(2)} €
        </p>
      </div>
    </div>
  );
}
