# Table transactions

> [!NOTE]
> méthode d'archivage des transactions:
> - nom, prénom, email de l'utilisateur, siren de l'entreprise si partner
> - nom, prénom, email de l'utilisateur, siren de l'entreprise si partner
> - date de la transaction
> - gardé pendant 10ans (Art. L123-22 du code de commerce, Art. L102 B du LPF)
> Les archives de transaction sont créer au moment de la confirmation de la transaction.


#### `id`
Identifiant unique de la transaction, généré automatiquement lors de la transaction.

- Catégorie de donnée: Identifiant / donnée d'identification
- Finalité:
    - Identifier de manière unique la transaction.
    - Assurer le fonctionnement technique des fonctionnalités du site.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6).
- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: Non-applicable, toujours fourni.
- Durée de conservation: Pendant toute la durée d'existence du compte de tout les partis de la transaction. Suppression lors de la clôture du compte de tout les partis de la transaction.


#### `userId`
Identifiant unique d'un des parti de la transaction, récupéré automatiquement lors de la transaction.

- Catégorie de donnée: Identifiant / donnée d'identification
- Finalité:
    - Identifier de manière unique un des parti de la transaction.
    - Assurer le fonctionnement technique des fonctionnalités du site.
    - Archivage.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6), [Code de commerce Art. L123-22](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006219327/), [Livre des Procédures Fiscales Art. L102 B](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041471233/).
- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: Non-applicable, toujours fourni.
- Durée de conservation: Pendant toute la durée d'existence du compte de tout les partis de la transaction. Suppression lors de la clôture du compte de tout les partis de la transaction, continue d'exister sous forme d'archive pendant 10 ans à compter du 31 décembre de l'année de l'opération.


#### `amount`
Montant de la transaction, décidé par l'un des parti de la transaction.

- Catégorie de donnée: Donnée de gestion
- Finalité:
    - Archivage.
    - Assurer le fonctionnement technique des fonctionnalités du site.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6), [Code de commerce Art. L123-22](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006219327/), [Livre des Procédures Fiscales Art. L102 B](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041471233/).
- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: Non-applicable, toujours fourni.
- Durée de conservation: Pendant toute la durée d'existence du compte de tout les partis de la transaction. Suppression lors de la clôture du compte de tout les partis de la transaction, continue d'exister sous forme d'archive pendant 10 ans à compter du 31 décembre de l'année de l'opération.


#### `partnerId`
Identifiant unique de l'autre parti de la transaction, récupéré automatiquement lors de la transaction.

- Catégorie de donnée: Identifiant / donnée d'identification
- Finalité:
    - Identifier de manière unique un des parti de la transaction.
    - Assurer le fonctionnement technique des fonctionnalités du site.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6), [Code de commerce Art. L123-22](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006219327/), [Livre des Procédures Fiscales Art. L102 B](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041471233/).
- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: Non-applicable, toujours fourni.
- Durée de conservation: Pendant toute la durée d'existence du compte de tout les partis de la transaction. Suppression lors de la clôture du compte de tout les partis de la transaction, continue d'exister sous forme d'archive pendant 10 ans à compter du 31 décembre de l'année de l'opération.


#### `createdAt`
Date de la transaction, récupéré automatiquement lors de la transaction.

- Catégorie de donnée: Identifiant / donnée d'identification
- Finalité:
    - Archivage.
    - Assurer le fonctionnement technique des fonctionnalités du site.
- Base légale: [Exécution du contrat (art.6.1.b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6), [Code de commerce Art. L123-22](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006219327/), [Livre des Procédures Fiscales Art. L102 B](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041471233/).
- Caractère: Nécessaire.
- Conséquence en cas de non-fourniture: Non-applicable, toujours fourni.
- Durée de conservation: Pendant toute la durée d'existence du compte de tout les partis de la transaction. Suppression lors de la clôture du compte de tout les partis de la transaction, continue d'exister sous forme d'archive pendant 10 ans à compter du 31 décembre de l'année de l'opération.

