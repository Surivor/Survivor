import Link from "next/link";

export default function WaitingAccValidationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 text-center shadow-md">
        <h1 className="text-2xl font-bold font-title text-primary">
          En attente de validation
        </h1>
        <p className="text-sm text-primary">
          Votre demande d'inscription a bien été reçue. Un administrateur du
          Ministère doit valider votre compte avant que vous puissiez y accéder.
        </p>
        <Link
          href="/"
          className="inline-block text-sm font-semibold text-action hover:underline"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}