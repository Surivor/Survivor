export default function QrCodeCard() {

  return (
      <button className="w-full max-w-2xl rounded-2xl bg-gray-200 p-7 text-black border-b-black border-2 cursor-pointer">
          <div className="flex items-left gap-10">
              <img src="/qrcode.png" alt="QR Code" className="w-15 h-15" />
              <div className="space-y-3">
                  <p className="text-xl opacity-90 mb-2 -ml-20">Générer un QR code</p>
                  <p className="text-sm opacity-90">À présenter chez un partenaire pour payer</p>
              </div>
          </div>
      </button>
  );
}
