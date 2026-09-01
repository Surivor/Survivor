import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 px-4">
      <h1 className="text-3xl font-bold font-title text-primary">CartePro</h1>

      <div className="flex w-full max-w-2xl flex-col gap-6 sm:flex-row">
        <Link
          href="/login"
          className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-action px-6 py-10 text-center text-white shadow-md transition-colors hover:bg-action/90"
        >
          <span className="text-xl font-semibold">Se connecter</span>
          <span className="text-sm text-white/80">
            Déjà un compte? Accédez à votre espace
          </span>
        </Link>

        <Link
          href="/signup"
          className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-action px-6 py-10 text-center text-white shadow-md transition-colors hover:bg-action/90"
        >
          <span className="text-xl font-semibold">Créer un compte</span>
          <span className="text-sm text-white/80">
            Pas encore de compte? Créez en un
          </span>
        </Link>
      </div>
    </div>
  );
}