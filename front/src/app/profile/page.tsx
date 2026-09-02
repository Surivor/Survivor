"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";
import BalanceCard from "@/components/BalanceCard";

type UserProfile = {
  id: number;
  name: string;
  firstname: string;
  email: string;
  status: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [meRes, balanceRes] = await Promise.all([
          fetch("http://localhost:3000/auth/me", { headers }),
          fetch("http://localhost:3000/api/transactions/balance", { headers }),
        ]);

        if (meRes.status === 401 || balanceRes.status === 401) {
          removeToken();
          router.push("/login");
          return;
        }

        if (!meRes.ok || !balanceRes.ok) {
          throw new Error("Impossible de charger le profil");
        }

        const meData = await meRes.json();
        const balanceData = await balanceRes.json();

        setUser(meData);
        setBalance(balanceData.balance);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-primary">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <p className="text-sm text-red-600">{error ?? "Profil introuvable"}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-zinc-50 px-4 pt-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-7 shadow-md">
        <h1 className="text-2xl font-bold font-title text-primary mb-4">Mon profil</h1>

        <div className="space-y-2 text-sm text-zinc-900">
          <p><span className="font-semibold">Nom :</span> {user.name}</p>
          <p><span className="font-semibold">Prénom :</span> {user.firstname}</p>
          <p><span className="font-semibold">Email :</span> {user.email}</p>
        </div>
      </div>

      {balance !== null && <BalanceCard/>}
    </div>
  );
}