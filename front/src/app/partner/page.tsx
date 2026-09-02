import Partener_main from "@/components/Partener_main";

async function GetParteners() {
    const result = await fetch("http://backend:3000/api/partners", {
        cache: "no-cache"
    });
    if (!result.ok)
        throw new Error("Failed to fetch partners");
    return result.json();
}

export default async function mainPage() {
    const partners = await GetParteners();

    return (
        <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4">
            <Partener_main partners={partners} />
        </div>
    );
}