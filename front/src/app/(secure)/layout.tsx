"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";

export default function SecureLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    async function verifyAccess() {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
          removeToken();
          router.push("/login");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        removeToken();
        router.push("/login");
      }
    }

    verifyAccess();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        {}
        <p className="font-marianne font-bold text-[#1B3A6B]">Vérification sécurisée en cours...</p>
      </div>
    );
  }

  return <>{children}</>;
}