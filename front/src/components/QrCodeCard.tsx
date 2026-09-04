"use client";
import SimulationBanner from "./SimulationBanner";

import { useState } from "react";
import { getToken } from "@/lib/auth";

export default function QrCodeCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenPopup = async () => {
    setIsOpen(true);
    setLoading(true);
    
    try {
      const token = getToken();
      const res = await fetch("api/transactions/qrcode", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const textToken = await res.text();
        setQrToken(textToken); 
      }
    } catch (e) {
      console.error("Erreur API:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!qrToken) return;
    try {
      await navigator.clipboard.writeText(qrToken);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Échec de la copie", err);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenPopup}
        className="flex w-full cursor-pointer items-center justify-between rounded-[18px] border border-zinc-200 bg-[#f3f3f4] px-5 py-4 text-left text-black shadow-sm transition hover:bg-[#ebebee]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/80 p-2 shadow-sm">
            <img src="/qrcode.png" alt="Icône QR Code" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <p className="text-[17px] font-bold font-title text-zinc-900">Générer un QR code</p>
            <p className="mt-1 text-[15px] text-zinc-600">À présenter chez un partenaire pour payer</p>
          </div>
        </div>
        <span className="text-2xl text-zinc-500">›</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold font-title text-zinc-900">Votre paiement</h3>
              <button onClick={() => setIsOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg text-zinc-600 transition hover:bg-zinc-200">×</button>
            </div>

            <div className="rounded-[22px] border border-zinc-200 bg-[#f9f9fa] p-6 flex flex-col items-center justify-center min-h-[250px]">
              {loading ? (
                <p className="text-sm font-bold text-[#1B3A6B]">Génération sécurisée...</p>
              ) : qrToken ? (
                <div 
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative cursor-pointer transition-transform active:scale-95"
                  onClick={handleCopy}
                  title="Cliquer pour copier le token"
                >
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=1B3A6B&data=${qrToken}`} 
                    alt="QR code dynamique" 
                    className="mx-auto h-48 w-48 object-contain" 
                  />
                  {isCopied && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1.5 rounded text-sm font-bold shadow-lg">
                      Token copié !
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm font-bold text-red-500">Erreur de connexion au serveur.</p>
              )}
            </div>
            
            <p className="mt-6 text-center text-sm text-zinc-600 font-body">
              Présentez ce code au partenaire. <br/>
              <span className="text-xs text-gray-400">Valable 30 minutes.</span>
            </p>
          </div>
        </div>
      )}
      <SimulationBanner />
    </>
  );
}