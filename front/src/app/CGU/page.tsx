"use client";

import { useRouter } from 'next/navigation'

export default function CGUPage() {
  const router = useRouter()


    return (
        <div className="min-h-screen bg-zinc-50 px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-1 text-sm font-semibold text-action hover:underline"
            >
              ← Retour
            </button>

            <div className="rounded-2xl bg-white p-8 shadow-md">
              <h1 className="mb-1 text-center text-2xl font-bold font-title text-primary">
                Ticket Tout
              </h1>
              <p className="mb-8 text-center text-sm text-zinc-500">
                Conditions générales d'utilisation — dernière mise à jour : 03/09/2026
              </p>

              <div className="space-y-8 text-sm text-zinc-900">
                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    1. Objet
                  </h2>
                  <p>
                    Les présentes Conditions Générales d'Utilisation (CGU) définissent
                    les règles d'utilisation du démonstrateur Ticket Tout.
                  </p>
                  <p className="mt-2">
                    Ticket Tout permet de simuler l'utilisation d'un dispositif de
                    paiement auprès de partenaires. Les opérations réalisées dans le
                    cadre du démonstrateur sont fictives et n'ont pas de valeur
                    monétaire réelle.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    2. Création et utilisation du compte
                  </h2>
                  <p>
                    L'utilisateur peut créer un compte en renseignant les informations
                    demandées dans le formulaire d'inscription.
                  </p>
                  <p className="mt-2">
                    Une fois le compte créé et validé, l'utilisateur peut accéder à
                    son espace personnel à l'aide de ses identifiants de connexion.
                  </p>
                  <p className="mt-2">
                    L'utilisateur est responsable de l'exactitude des informations
                    renseignées lors de la création de son compte ainsi que de la
                    confidentialité de ses identifiants.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    3. Solde disponible
                  </h2>
                  <p>
                    Chaque utilisateur dispose d'un solde permettant d'effectuer des
                    paiements dans le cadre du démonstrateur. Il n'existe aucun
                    plafond de solde : le montant disponible peut être conservé et
                    augmenter au fil des périodes.
                  </p>
                  <p className="mt-3 font-semibold">Solde insuffisant</p>
                  <p>
                    Lorsqu'un utilisateur tente d'effectuer une transaction alors que
                    son solde est insuffisant, la transaction est bloquée. Un message
                    d'erreur « Solde insuffisant ! » est alors affiché à
                    l'utilisateur. La transaction n'est pas validée et le solde de
                    l'utilisateur n'est pas débité.
                  </p>
                  <p className="mt-3 font-semibold">
                    Solde non consommé en fin de période
                  </p>
                  <p>
                    Le solde restant à la fin d'une période est conservé
                    intégralement sur le compte de l'utilisateur. Il n'est pas remis
                    à zéro et peut être utilisé au cours des périodes suivantes.
                    Aucun plafond de solde ne s'applique.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    4. Paiement
                  </h2>
                  <p>
                    L'utilisateur peut effectuer un paiement depuis la page
                    « Accueil » en sélectionnant le bouton « Générer un QR code ». Un
                    QR code est alors généré et présenté à l'utilisateur afin de
                    simuler le paiement auprès d'un partenaire. Lorsque les
                    conditions nécessaires au paiement sont remplies, la transaction
                    est validée et enregistrée dans l'historique.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    5. Annulation d'une transaction
                  </h2>
                  <p>
                    Une transaction validée ne peut pas être annulée. L'application
                    ne prévoit aucune fonctionnalité permettant à l'utilisateur, au
                    partenaire ou à un administrateur d'annuler une transaction après
                    sa validation. Les transactions validées restent donc
                    enregistrées dans l'historique.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    6. Historique
                  </h2>
                  <p>
                    La rubrique « Historique » permet à l'utilisateur de consulter
                    les transactions enregistrées sur son compte. Elle permet
                    notamment de suivre les paiements effectués dans le cadre du
                    démonstrateur.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    7. Partenaires
                  </h2>
                  <p>
                    La rubrique « Partenaires » permet de consulter la liste des
                    partenaires référencés dans l'application ainsi que les
                    informations associées à ceux-ci.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    8. Profil
                  </h2>
                  <p>
                    La rubrique « Profil » permet à l'utilisateur de consulter les
                    informations associées à son compte ainsi que son solde
                    disponible.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    9. Déconnexion
                  </h2>
                  <p>
                    L'utilisateur peut se déconnecter depuis la rubrique « Profil »
                    en sélectionnant le bouton « Déconnexion ». Après déconnexion,
                    l'utilisateur est redirigé vers l'écran initial de l'application.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    10. Nature du démonstrateur
                  </h2>
                  <p>
                    Ticket Tout est un démonstrateur destiné à présenter et simuler
                    le fonctionnement d'un service de paiement. Les comptes, soldes,
                    QR codes et transactions présentés dans l'application sont
                    fictifs. Aucun paiement réel n'est effectué et aucun montant
                    affiché dans l'application ne constitue une somme d'argent
                    réelle.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    11. Accessibilité
                  </h2>
                  <p>
                    Le démonstrateur est conçu en prenant en compte les exigences du
                    Référentiel général d'amélioration de l'accessibilité (RGAA). Une
                    déclaration d'accessibilité est mise à disposition afin de
                    présenter le niveau de conformité du site, les éventuelles
                    non-conformités identifiées et les améliorations prévues.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    12. Évolution du service
                  </h2>
                  <p>
                    Les présentes CGU correspondent au fonctionnement du
                    démonstrateur à la date de leur dernière mise à jour. Toute
                    modification des fonctionnalités ou des règles de fonctionnement
                    de l'application pourra entraîner une mise à jour des présentes
                    CGU.
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-title text-lg font-bold text-primary">
                    13. Contact
                  </h2>
                  <p>
                    Pour toute question concernant l'utilisation du démonstrateur
                    Ticket Tout, l'utilisateur peut contacter :
                  </p>
                  <p className="mt-1 font-semibold text-primary">
                    ronan.botrel@epitech.eu
                  </p>
                </section>
              </div>
            <button
                onClick={() => router.push("/profile")}
                className="mt-10 w-full rounded-lg bg-action py-3 text-sm font-semibold text-white transition-colors hover:bg-action/90"
              >
                J'ai lu et j'accepte les CGU
              </button>
            </div>
          </div>
        </div>
      );
}