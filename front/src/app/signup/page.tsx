"use client";

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nom = formData.get('nom')
    const prenom = formData.get('prenom')
    const statut = formData.get('statut')
    const email = formData.get('email')
    const password = formData.get('password')

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, statut, email, password }),
    })

    if (response.ok) {
      router.push('/profile')
    } else {
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl text-zinc-900"
      >
        <h1 className="text-center text-2xl font-bold text-zinc-900">
          CartePro
        </h1>
        <p className="text-center text-sm text-zinc-900">
          Rejoignez CartePro
        </p>

        <input
          type="nom"
          name="nom"
          placeholder="Nom"
          required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <input
          type="prenom"
          name="prenom"
          placeholder="Prenom"
          required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <input
          type="statut"
          name="statut"
          placeholder="Statut"
          required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}