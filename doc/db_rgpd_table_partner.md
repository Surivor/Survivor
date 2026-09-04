# Table partenaire

> [!NOTE]
> Toute entreprise partenaire est associé à un compte utilisateur et est donc soumis aux informations données sur la [Table utilisateur](./db_rgpd_table_user.md)


#### `id`
Identifiant unique de l'entrprise partenaire, généré automatiquement lors de la création du compte, identique à l'id utilisateur correspondant à l'entreprise.

- Catégorie de donnée: Identifiant / donnée d'identification
- Finalité:
    - Identifier de manière unique le compte partenaire.
    - Associer les différentes données et actions au compte concerné.
    - Assurer le fonctionnement technique du compte et des fonctionnalités du site.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).
- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: Non-applicable, toujours fourni.
- Durée de conservation: Pendant toute la durée d'existence du compte. Suppression lors de sa clôture.


#### `siren`
SIREN de l'entreprise, renseigné par l'entreprise lors de la création de son compte.

- Catégorie de donnée: Identité
- Finalité:
    - Identifier l'entreprise.
    - Permettre la mise en relation entre les salariés et les entreprises.
    - Permettre la gestion du compte partenaire.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).

- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: La création et le fonctionnement du compte ne sont pas possibles.
- Durée de conservation: Pendant toute la durée d'existence du compte. Archivée sur toutes transactions liées, voir **[rgpd de la table des transactions](./db_rgpd_table_transactions.md)**, Supprimé des autres informations.


#### `objet_social`
Secteur d'activité de l'entreprise partenaire.

- Catégorie de donnée: Identité
- Finalité:
    - Identifier l'entreprise.
    - Permettre la mise en relation entre les salariés et les entreprises.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).

- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: La création et le fonctionnement du compte ne sont pas possibles.
- Durée de conservation: Pendant toute la durée d'existence du compte. Supprimé lors de la clôture du compte.


#### `verified`
Vrai ou faux, l'entreprise à été vérifié par le ministère.

- Catégorie de donnée: Donnée de gestion
- Finalité:
    - Permettre la mmise en relation entre les salariées et les entreprises.
    - Permettre la mise en avant de l'entreprise.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).

- Caractère: Non-applicable, fourni par le service.
- Conséquence en cas de non-fourniture: Non-applicable.
- Durée de conservation: Pendant toute la durée d'existence du compte ou modification par le service. Supprimé lors de la clôture du compte.


#### `featured`
Vrai ou faux, l'entreprise est mise en avant sur la page d'acceuil.

- Catégorie de donnée: Donnée de gestion
- Finalité:
    - Permettre la mmise en relation entre les salariées et les entreprises.
    - Permettre la mise en avant de l'entreprise.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).

- Caractère: Non-applicable, fourni par le service.
- Conséquence en cas de non-fourniture: Non-applicable.
- Durée de conservation: Pendant toute la durée d'existence du compte ou modification par le service. Supprimé lors de la clôture du compte.

