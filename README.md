# Ticket Tout

---

## 🇬🇧 English

### Table of contents
1. **[Run from a Release (Production/Client)](#run-from-a-release-productionclient)**
2. **[Starting Ticket Tout (Development)](#starting-ticket-tout-development)**
3. **[Other Documentation](#documentation)**

### Run from a Release (Production/Client)

If you just want to run the application without downloading the source code or compiling anything, use the pre-built release files.

1. Go to the **Releases** page of this repository and download these 3 files into a single folder on your machine:
   - `docker-compose.yml`
   - `backend.tar`
   - `frontend.tar`

2. Open a terminal in that folder and load the Docker images:
```sh
docker load -i backend.tar
docker load -i frontend.tar
```

3. Start the application:
```sh
docker compose up
```

You can then access the app at **[localhost:3001](http://localhost:3001)**. To stop the application, use `Ctrl+C`.

### Starting Ticket Tout (Development)

At the repo's root:
```sh
docker compose up
```

You can then access the app at **[localhost:3001](http://localhost:3001)**

### Documentation

- **[DB schema](./doc/db_scheme.md)**

---

## 🇫🇷 Français

### Table des matières
1. **[Lancer depuis une Release (Production/Client)](#lancer-depuis-une-release-productionclient)**
2. **[Lancer Ticket Tout (Développement)](#lancer-ticket-tout-développement)**
3. **[Autre Documentation](#autre-documentation)**

### Lancer depuis une Release (Production/Client)

Si vous souhaitez simplement lancer l'application sans télécharger le code source ni compiler quoi que ce soit, utilisez les fichiers prêts à l'emploi de la release.

1. Allez sur la page **Releases** de ce dépôt et téléchargez ces 3 fichiers dans un même dossier sur votre machine :
   - `docker-compose.yml`
   - `backend.tar`
   - `frontend.tar`

2. Ouvrez un terminal dans ce dossier et chargez les images Docker :
```sh
docker load -i backend.tar
docker load -i frontend.tar
```

3. Lancez l'application :
```sh
docker compose up
```

Vous pouvez ensuite accéder à l'application sur **[localhost:3001](http://localhost:3001)**. Pour arrêter l'application, faites `Ctrl+C`.

### Lancer Ticket Tout (Développement)

À la racine du dépôt :
```sh
docker compose up
```

Vous pouvez ensuite accéder à l'application sur **[localhost:3001](http://localhost:3001)**

### Autre Documentation

- **[Schéma de la base de données](./doc/db_scheme.md)**