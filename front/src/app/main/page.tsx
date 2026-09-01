import BalanceCard from "@/components/BalanceCard";
import QrCodeCard from "@/components/QrCodeCard";

export default function mainPage() {
    return (
        <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4 pt-8">
            <BalanceCard/>
            <QrCodeCard/>
        </div>
    );
}