"use client";

import { useEffect, useState } from "react";
import FeaturedPartnerCard from "./FeaturedPartnerCard";

export default function FeaturedPartnerSection() {
    const [featuredPartner, setFeaturedPartner] = useState<any>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch("/api/partners/featured");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setFeaturedPartner(data[0]);
                    } else if (data && !Array.isArray(data)) {
                        setFeaturedPartner(data);
                    }
                } else {
                    const resVerified = await fetch("/api/partners/verified");
                    if (resVerified.ok) {
                        const data = await resVerified.json();
                        if (Array.isArray(data)) {
                            const found = data.find(p => p.featured === true);
                            if (found) setFeaturedPartner(found);
                        }
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement du partenaire coup de coeur :", error);
            }
        };

        fetchFeatured();
    }, []);

    if (!featuredPartner) return null;

    return (
        <div className="w-full max-w-2xl mt-4">
            <FeaturedPartnerCard partner={featuredPartner} />
        </div>
    );
}
