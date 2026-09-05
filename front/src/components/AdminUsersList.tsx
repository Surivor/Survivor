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
  resourceType?: "user" | "partner";
}

export default function AdminUsersList({ resourceType }: AdminUsersListProps) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [isVerified, setIsVerified] = useState('');
  const [loading, setLoading] = useState(false);

  const status = resourceType === "partner" ? "partenaire" : resourceType === "user" ? "user" : "";

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

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
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

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
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
                  <td className="px-4 py-2 font-medium text-zinc-800">{u.name}</td>
                  <td className="px-4 py-2 text-zinc-600">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold uppercase text-zinc-700">
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/${u.status === 'partenaire' ? 'partners' : 'users'}/${u.id}`}
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
    </div>
  );
}