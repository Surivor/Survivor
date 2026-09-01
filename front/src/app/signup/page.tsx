"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [statut, setStatut] = useState('')

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)

    const body: Record<string, FormDataEntryValue | null> = {
      name: formData.get('nom'),
      firstname: formData.get('prenom'),
      status: formData.get('statut'),
      email: formData.get('email'),
      password: formData.get('password'),
    }
    if (statut === 'partenaire') {
      body.companyName = formData.get('companyName')
      body.businessPurpose = formData.get('businessPurpose')
      body.siren = formData.get('siren')
    }
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      router.push('/after_signup')
    } else {
      const data = await response.json().catch(() => null)
      setError(data?.message ?? "Erreur lors de l'inscription")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl"
      >
        <h1 className="text-center text-2xl font-bold font-title text-primary">CartePro</h1>
        <p className="text-center text-sm text-primary">Rejoignez CartePro</p>

        <input type="text" name="nom" placeholder="Nom" required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

        <input type="text" name="prenom" placeholder="Prenom" required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

        <select
          name="statut"
          required
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="" disabled>Choisissez un statut</option>
          <option value="admin">Admin</option>
          <option value="user">Salarié</option>
          <option value="partenaire">Partenaire</option>
        </select>

        {statut === 'partenaire' && (
          <>
            <input type="text" name="companyName" placeholder="Nom de l'entreprise" required
              className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

            <input type="text" name="businessPurpose" placeholder="Objet social" required
              className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

            <input
              type="text"
              name="siren"
              placeholder="SIREN (9 chiffres)"
              required
              inputMode="numeric"
              pattern="[0-9]{9}"
              title="Le SIREN doit contenir exactement 9 chiffres"
              maxLength={9}
              className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </>
        )}

        <input type="email" name="email" placeholder="Email" required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

        <input type="password" name="password" placeholder="Mot de passe" required
          className="w-full rounded-lg border border-zinc-500 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <button type="submit"
          className="w-full rounded-lg bg-action py-2 text-sm font-semibold text-white transition-colors hover:bg-action/90">
          Créer mon compte
        </button>
      </form>
    </div>
  )
}