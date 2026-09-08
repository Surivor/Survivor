"use client";

import { useState, useEffect } from 'react';
import { getToken } from '@/lib/auth';

import Link from 'next/link';

interface UserItem {
  id: number;
  name: string;
  email: string;
  status: string;
  isVerified: boolean;
  isAdmin: boolean;
}

interface AdminUsersListProps {
  resourceType?: "user" | "partner" | "enterprise";
}

import { io } from "socket.io-client";


export default function AdminUsersList({ resourceType }: AdminUsersListProps) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [isVerified, setIsVerified] = useState('');
  const [loading, setLoading] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set());
  const [creditAmounts, setCreditAmounts] = useState<Record<number, string>>({});
  const [creditLoadingId, setCreditLoadingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const status = resourceType === "partner" ? "partenaire" : resourceType === "user" ? "user" : resourceType === "enterprise" ? "entreprise-SIRH" : "";

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const token = getToken();
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (isVerified) params.append('isVerified', isVerified);

        const res = await fetch(`/api/users/admin/all?${params.toString()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Erreur chargement utilisateurs:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status, isVerified]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io(window.location.origin, {
      path: "/socket.io/",
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("online_users", (data: { users: number[] }) => {
      setOnlineUserIds(new Set(data.users));
    });

    socket.on("user_connected", (data: { userId: number }) => {
      setOnlineUserIds(prev => {
        const newSet = new Set(prev);
        newSet.add(data.userId);
        return newSet;
      });
    });

    socket.on("user_disconnected", (data: { userId: number }) => {
      setOnlineUserIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    socket.on("new_user_registered", (newUser: UserItem) => {
      setUsers(prev => {
        const currentStatus = resourceType === "partner" ? "partenaire" : resourceType === "user" ? "user" : resourceType === "enterprise" ? "entreprise-SIRH" : "";
        if (currentStatus && newUser.status !== currentStatus) {
          return prev;
        }
        if (prev.some(u => u.id === newUser.id)) return prev;
        return [newUser, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [resourceType]);

  const handleCredit = async (userId: number) => {
    const amountStr = creditAmounts[userId];
    const amount = Number(amountStr);
    if (!amount || amount <= 0) {
      showNotification("Montant invalide", "error");
      return;
    }

    setCreditLoadingId(userId);
    try {
      const token = getToken();
      const res = await fetch("/api/transactions/admin/credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          amount,
        }),
      });

      if (res.ok) {
        showNotification("Crédit ajouté avec succès", "success");
        setCreditAmounts(prev => ({ ...prev, [userId]: "" }));
      } else {
        const data = await res.json();
        showNotification(data.message || "Erreur lors du crédit", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Erreur réseau", "error");
    } finally {
      setCreditLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-action"
        />
        <select
          value={isVerified}
          onChange={(e) => setIsVerified(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-action"
        >
          <option value="">Tous les comptes</option>
          <option value="true">Actifs</option>
          <option value="false">Suspendus / En attente</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-zinc-400">Recherche en cours...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-zinc-400">Aucun résultat</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-2 font-mono text-xs text-zinc-500">{u.id}</td>
                  <td className="px-4 py-2 font-medium text-zinc-800 flex items-center gap-2">
                    {onlineUserIds.has(u.id) ? (
                      <span className="h-2 w-2 rounded-full bg-green-500" title="En ligne" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-zinc-300" title="Hors ligne" />
                    )}
                    {u.name}
                  </td>
                  <td className="px-4 py-2 text-zinc-600">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold uppercase text-zinc-700">
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {resourceType === "user" && (
                      <div className="inline-flex items-center gap-2 mr-4">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Montant"
                          className="w-20 rounded border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-action"
                          value={creditAmounts[u.id] || ''}
                          onChange={e => {
                            const val = e.target.value;
                            if (Number(val) < 0) return;
                            setCreditAmounts(prev => ({ ...prev, [u.id]: val }));
                          }}
                          disabled={creditLoadingId === u.id}
                        />
                        <span className="text-zinc-500">€</span>
                        <button
                          onClick={() => handleCredit(u.id)}
                          disabled={creditLoadingId === u.id || !creditAmounts[u.id]}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {creditLoadingId === u.id ? '...' : 'Créditer'}
                        </button>
                      </div>
                    )}
                    <Link
                      href={`/admin/${u.status === 'partenaire' ? 'partners' : u.status === 'entreprise-SIRH' ? 'enterprises' : 'users'}/${u.id}`}
                      className="inline-block rounded-xl bg-action px-4 py-2 text-xs font-semibold text-white hover:bg-action/90 transition"
                    >
                      Gérer
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {notification && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-opacity z-50 ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}