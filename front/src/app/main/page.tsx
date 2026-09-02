import BalanceCard from "@/components/BalanceCard";
import QrCodeCard from "@/components/QrCodeCard";
import Header from "@/components/Header";
import HistoryMain from "../../components/History_main";
import Partener_main from "../../components/Partener_main";

export default function mainPage() {
    return (
        <>
        <Header />
        <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4 pt-8">
            <div className="w-full max-w-5xl flex flex-col items-center gap-8">
                <BalanceCard/>
                <QrCodeCard/>
                <div className="flex items-start gap-2.5 w-full">
                    <HistoryMain/>
                    <Partener_main/>
                </div>
            </div>
        </div>
        </>
    );
}