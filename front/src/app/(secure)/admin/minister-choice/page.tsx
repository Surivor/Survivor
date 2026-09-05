"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getToken } from "@/lib/auth";
import HeartButton from "./HeartButton";

interface Partner {
  id: number;
  siren: number;
  objet_social: string;
  verified: boolean;
  featured: boolean;
  user?: {
    name: string;
    email: string;
  };
}

export default function MinisterChoicePage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [loadingPartners, setLoadingPartners] = useState<Set<number>>(new Set());
  const [animatingPartners, setAnimatingPartners] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = getToken();
        const res = await fetch("/api/partners/verified", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          setPartners(data);
        }
      } catch (err) {
        console.error("Erreur chargement partenaires:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleToggleFeatured = async (partnerId: number, currentState: boolean) => {
    if (loadingPartners.has(partnerId)) return;

    const newState = !currentState;
    
    const previousPartners = [...partners];

    setPartners(current => current.map(p => {
      if (p.id === partnerId) {
        return { ...p, featured: newState };
      }
      if (newState && p.featured) {
        return { ...p, featured: false };
      }
      return p;
    }));

    if (newState) {
        setAnimatingPartners(prev => new Set(prev).add(partnerId));
        setTimeout(() => {
            setAnimatingPartners(prev => {
                const next = new Set(prev);
                next.delete(partnerId);
                return next;
            });
        }, 450);
    }

    setLoadingPartners(prev => new Set(prev).add(partnerId));

    try {
      const token = getToken();
      const res = await fetch(`/api/partners/${partnerId}/featured`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ featured: newState }),
      });

      if (!res.ok) {
          throw new Error("Erreur serveur lors de la mise à jour");
      }
    } catch (error) {
      console.error(error);
      setPartners(previousPartners);
    } finally {
      setLoadingPartners(prev => {
          const next = new Set(prev);
          next.delete(partnerId);
          return next;
      });
    }
  };

  const filteredPartners = partners.filter(partner => {
    const name = partner.user?.name?.toLowerCase() || "";
    const objetSocial = partner.objet_social?.toLowerCase() || "";
    const siren = partner.siren?.toString() || "";
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || objetSocial.includes(query) || siren.includes(query);
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 md:px-8 py-8 md:py-12">
        <div className="w-full max-w-6xl space-y-6 md:space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="font-title text-2xl md:text-3xl font-bold text-primary uppercase">
              Coups de cœur du Ministre
            </h1>
            <div className="w-full sm:w-auto relative">
              <input
                type="text"
                placeholder="Rechercher (Nom, SIREN...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded-full border border-zinc-300 pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <p className="text-zinc-500 font-medium">Chargement des partenaires...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="flex justify-center p-12 bg-white rounded-2xl border border-zinc-200">
              <p className="text-zinc-500 font-medium">
                {searchQuery ? "Aucun partenaire ne correspond à cette recherche." : "Aucun partenaire validé trouvé."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="relative flex flex-col justify-between bg-white rounded-3xl p-6 md:p-8 border-2 border-zinc-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl md:text-2xl font-bold font-title text-primary uppercase pr-12 line-clamp-2">
                      {partner.user?.name || "Partenaire sans nom"}
                    </h2>
                    
                    <div className="absolute top-6 right-6">
                      <HeartButton 
                        isFeatured={partner.featured} 
                        isAnimating={animatingPartners.has(partner.id)}
                        isLoading={loadingPartners.has(partner.id)}
                        onToggle={() => handleToggleFeatured(partner.id, partner.featured)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-500">
                      <span className="font-semibold text-zinc-700">SIREN:</span> {partner.siren}
                    </p>
                    <div className="h-[1px] w-full bg-zinc-100 my-2"></div>
                    <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {partner.objet_social || "Aucune description fournie pour ce partenaire."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
