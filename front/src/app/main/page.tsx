import BalanceCard from "@/components/BalanceCard";
import QrCodeCard from "@/components/QrCodeCard";
import Header from "@/components/Header";

export default function mainPage() {
    return (
        <>
        <Header />
        <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4 pt-8">
            <BalanceCard/>
            <QrCodeCard/>
        </div>
        </>
    );
}