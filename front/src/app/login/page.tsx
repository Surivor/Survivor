"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveToken } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = (formData.get('email') as string)?.trim()
    const password = (formData.get('password') as string)?.trim()

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message ?? "Email ou mot de passe incorrect")
      }

      const data = await response.json()
      saveToken(data.access_token)
      router.push('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de se connecter au serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm space-y-4 rounded-2xl">
        <h1 className="text-center text-2xl font-bold font-title text-primary">Ticket Tout</h1>
        <p className="text-center text-sm text-primary">Connectez-vous à votre espace</p>

        <input type="email" name="email" placeholder="Email" required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-action focus:ring-1 focus:ring-action" />

        <input type="password" name="password" placeholder="Mot de passe" required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-action focus:ring-1 focus:ring-action" />

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full rounded-lg bg-action py-2 text-sm font-semibold text-white transition-colors hover:bg-action/90 disabled:opacity-50">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  )
}