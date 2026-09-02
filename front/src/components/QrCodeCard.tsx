"use client";

import { useState } from "react";

export default function QrCodeCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full cursor-pointer items-center justify-between rounded-[18px] border border-zinc-200 bg-[#f3f3f4] px-5 py-4 text-left text-black shadow-sm transition hover:bg-[#ebebee]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/80 p-2 shadow-[inset_0_0_0_1px_rgba(24,24,27,0.04)]">
            <img src="/qrcode.png" alt="QR Code" className="h-8 w-8 object-contain" />
          </div>

          <div>
            <p className="text-[17px] font-medium text-zinc-900">Générer un QR code</p>
            <p className="mt-1 text-[15px] text-zinc-600">À présenter chez un partenaire pour payer</p>
          </div>
        </div>

        <span className="text-2xl text-zinc-500">›</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-zinc-900">Votre QR code</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg text-zinc-600 transition hover:bg-zinc-200"
                aria-label="Fermer la popup"
              >
                ×
              </button>
            </div>

            <div className="rounded-[22px] border border-zinc-200 bg-[#f9f9fa] p-4">
              <img src="/qrcode.png" alt="QR code de paiement" className="mx-auto h-56 w-56 object-contain" />
            </div>

            <p className="mt-4 text-center text-sm text-zinc-600">
              Présentez ce code au partenaire pour finaliser le paiement.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
