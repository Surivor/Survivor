
# Table utilisateur

#### `id`
Identifiant unique de l'utilisateur, généré automatiquement lors de la création du compte.

- Catégorie de donnée: Identifiant / donnée d'identification
- Finalité:
    - Identifier de manière unique le compte utilisateur.
    - Associer les différentes données et actions au compte concerné.
    - Assurer le fonctionnement technique du compte et des fonctionnalités du site.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).
- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: Non-applicable, toujours fourni.
- Durée de conservation: Pendant toute la durée d'existence du compte. Suppression lors de sa clôture.


#### `name`
Nom de l'utilisateur, renseigné par l'utilisateur lors de la création de son compte.

- Catégorie de donnée: Identité
- Finalité:
    - Identifier l'utilisateur.
    - Permettre la mise en relation entre les salariés et les entreprises.
    - Permettre la gestion du compte utilisateur.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).

- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: La création et le fonctionnement du compte ne sont pas possibles.
- Durée de conservation: Pendant toute la durée d'existence du compte. Archivée sur toutes transactions liées, voir **[rgpd de la table des transactions](./db_rgpd_table_transactions.md)**, Supprimé des autres informations.


#### `firstname`
Prénom de l'utilisateur, renseigné par l'utilisateur lors de la création de son compte.

- Catégorie de donnée : Identité
- Finalité:
    - Identifier l'utilisateur.
    - Permettre la mise en relation entre les salariés et les entreprises.
    - Permettre la gestion du compte utilisateur.
- Base légale:  [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).

- Caractère: Optionnel.
- Conséquence en cas de non-fourniture: Aucune.
- Durée de conservation: Pendant toute la durée d'existence du compte. Archivée sur toutes transactions liées, voir **[rgpd de la table des transactions](./db_rgpd_table_transactions.md)**, Supprimé des autres informations.



#### `email`
Adresse électronique de l'utilisateur.


- Catégorie de donnée : Coordonnées / données d'identification
- Finalité :
    - Identifier le compte lors de l'authentification.
    - Permettre la création et la gestion du compte.
    - Permettre l'envoi de communications nécessaires au fonctionnement du service.
    - Permettre la récupération du compte ou du mot de passe.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).

- Caractère : Nécessaire.
- Conséquence en cas de non-fourniture: La création du compte n'est pas possible.
- Durée de conservation proposée:  Pendant toute la durée d'existence du compte. Archivée sur toutes transactions liées, voir **[rgpd de la table des transactions](./db_rgpd_table_transactions.md)**, Supprimé des autres informations.


#### `password`
hash du mot de passe


- Catégorie de donnée : Donnée d'authentification / donnée de sécurité
- Finalité :
    - Authentifier l'utilisateur.
    - Sécuriser l'accès au compte.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).
- Conséquence en cas de non-fourniture : La création du compte n'est pas possible.
- Durée de conservation: Pendant toute la durée du compte ou jusqu'à son remplacement, Supprimé lors de la clôture du compte.


#### `siren_entreprise`
Numéro SIREN de l'entreprise où travaille l'utilisateur.
La valeur 0 peut être utilisée lorsque l'utilisateur n'est pas salarié d'une entreprise ou lorsque le compte correspond à une entreprise.

- Catégorie de donnée: Donnée relative à la vie professionnelle / donnée d'identification.
- Finalité :
    - Associer un compte salarié à son entreprise.
    - Permettre la gestion des droits d'accès liés à l'entreprise.
    - Permettre l'accès aux informations ou services dépendant de l'entreprise, notamment le solde.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).
- Caractère: Optionnel.
- Conséquence en cas de non-fourniture: Impossible d'associer correctement le salarié à son entreprise et de déterminer les droits ou informations auxquels il/elle et son entreprise peuvent accéder.
- Durée de conservation proposée: Pendant la durée du rattachement au compte, suppression ou mise à jour lorsque le rattachement n'est plus pertinent. Suppression lors de la clôture du compte.


#### `createdAt`
Date de création du compte, généré automatiquement.

- Catégorie de donnée : Donnée de gestion / donnée technique
- Finalité :
    - Assurer le suivi technique et administratif du compte.
    - Permettre la gestion du cycle de vie du compte.
    - Permettre, lorsque nécessaire, de déterminer l'ancienneté du compte.
    - Contribuer à la gestion des opérations techniques et de sécurité.
- Base légale:  [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6) et intérêt légitime pour les besoins de sécurité et de gestion technique.
- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: Non-applicable, toujours fourni.
- Durée de conservation proposée: Pendant la durée du compte. Supprimé lors de la clôture du compte.


#### `status`
Statut / rôle de l'utilisateur
Valeur permettant de déterminer le rôle attribué au compte, par exemple admin, user ou partner.

- Catégorie de donnée : Donnée relative au compte / habilitation
- Finalité:
    - Déterminer les droits d'accès du compte.
    - Déterminer les fonctionnalités accessibles à l'utilisateur.
    - Assurer la gestion des habilitations et la sécurité du système.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6) pour les droits nécessaires au service et/ou intérêt légitime pour la sécurité et la gestion des habilitations.
- Caractère : Nécessaire.
- Conséquence en cas de non-fourniture: La création du compte est impossible.
- Durée de conservation proposée: Pendant la durée du compte et du rôle attribué. Supprimé lors de la clôture du compte.

