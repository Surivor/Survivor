import Image from "next/image";

export default function StateBrand() {
    return (
        <div className="w-full bg-white px-6 py-4">
            <div className="container mx-auto">
                <Image
                    src="/bloc_marque_etat.jpeg"
                    alt="République française"
                    width={90}
                    height={35}
                    priority
                />
            </div>
        </div>
    );
}