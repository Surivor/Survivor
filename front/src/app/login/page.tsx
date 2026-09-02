"use client";

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('Ticket_tout_token', data.access_token)
      router.push('/profile')
    } else {
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl"
      >
        <h1 className="text-center text-2xl font-bold font-title text-primary">
          Ticket Tout
        </h1>
        <p className="text-center text-sm text-primary">
          Connectez-vous à votre espace
        </p>

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
          className="w-full rounded-lg bg-action py-2 text-sm font-semibold text-white transition-colors hover:bg-action/90"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}