import Link from "next/link";
import Header from "@/components/Header";

export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Header />
            
            <main className="flex flex-1 flex-col items-center justify-center px-4 md:px-8 py-8 md:py-12">
                <div className="w-full max-w-6xl">
                    
                    <div className="flex flex-col gap-10 md:gap-16">
                        
                        {/* Ligne 1 : Coup de coeurs */}
                        <div className="relative flex justify-center">
                            <span className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 text-sm font-semibold uppercase text-zinc-400">
                                Coeurs<br />design
                            </span>
                            <Link
                                href="/admin/minister-choice"
                                className="flex w-full md:w-2/3 items-center justify-center rounded-[32px] md:rounded-[40px] border-2 border-zinc-200 bg-white py-8 md:py-12 text-center font-title text-2xl md:text-4xl font-bold uppercase text-primary shadow-sm transition-transform hover:scale-105 hover:bg-zinc-100"
                            >
                                Coup de coeurs
                            </Link>
                        </div>

                        {/* Bloc Gestion : User & Partner */}
                        <div className="flex flex-col gap-6 md:gap-10 rounded-[32px] md:rounded-[40px] border-2 border-zinc-200 bg-white px-6 md:px-12 pb-8 md:pb-12 pt-6 md:pt-8 shadow-sm">
                            <h2 className="text-center font-title text-2xl md:text-4xl font-bold uppercase tracking-widest text-primary">
                                Gestion
                            </h2>
                            
                            <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-24 md:px-8">
                                <Link
                                    href="/admin/users"
                                    className="flex w-full md:w-1/2 items-center justify-center rounded-[24px] md:rounded-[28px] border-2 border-zinc-200 bg-zinc-50 py-6 md:py-8 text-center font-title text-xl md:text-2xl font-bold uppercase text-primary transition-transform hover:scale-105 hover:bg-zinc-100 hover:shadow-md"
                                >
                                    User
                                </Link>
                                <Link
                                    href="/admin/partners"
                                    className="flex w-full md:w-1/2 items-center justify-center rounded-[24px] md:rounded-[28px] border-2 border-zinc-200 bg-zinc-50 py-6 md:py-8 text-center font-title text-xl md:text-2xl font-bold uppercase text-primary transition-transform hover:scale-105 hover:bg-zinc-100 hover:shadow-md"
                                >
                                    Partner
                                </Link>
                            </div>
                        </div>

                        {/* Ligne 3 : Transaction */}
                        <div className="flex justify-center">
                            <Link
                                href="/admin/transactions"
                                className="flex w-full md:w-2/3 items-center justify-center rounded-[28px] md:rounded-[32px] border-2 border-zinc-200 bg-white py-8 md:py-14 text-center font-title text-2xl md:text-4xl font-bold uppercase text-primary shadow-sm transition-transform hover:scale-105 hover:bg-zinc-100"
                            >
                                Transaction
                            </Link>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}