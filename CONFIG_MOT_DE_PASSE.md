# Mot de passe du tableau de bord

Le **tableau de bord** (`/dashboard`) est protégé par un mot de passe. Seuls les mariés doivent le connaître.

## Créer le mot de passe

1. Ouvrez le fichier **`.env.local`** à la racine du projet (pas `.env.local.example`). Créez-le en copiant `.env.local.example` si besoin.

2. Ajoutez ou modifiez la ligne suivante avec le mot de passe de votre choix :

   ```env
   NEXT_PUBLIC_WEDDING_PASSWORD=VotreMotDePasseIci
   ```

   Exemple :

   ```env
   NEXT_PUBLIC_WEDDING_PASSWORD=MarieEtJean2025
   ```

   **Si votre mot de passe contient des caractères spéciaux** (comme `@`, `#`, `!`), mettez-le entre guillemets :

   ```env
   NEXT_PUBLIC_WEDDING_PASSWORD="@mariage2026"
   ```

3. Enregistrez le fichier, **arrêtez le serveur** (Ctrl+C dans le terminal), puis relancez **`npm run dev`**. Les variables `.env.local` ne sont lues qu’au démarrage du serveur.

## Utilisation

- En allant sur **http://localhost:3000/dashboard** (ou Tableau de bord dans le menu), vous êtes redirigé vers la page de connexion.
- Saisissez le mot de passe que vous avez défini dans `.env.local`.
- Après connexion, vous restez connecté pendant **24 heures** (cookie).

## Option : lien secret

Vous pouvez aussi accéder sans taper le mot de passe en utilisant un **lien secret**. Dans `.env.local` :

```env
NEXT_PUBLIC_WEDDING_SECRET=mon-secret-tres-personnel
```

Puis ouvrez par exemple :  
`http://localhost:3000/dashboard?secret=mon-secret-tres-personnel`  
Vous serez connecté automatiquement.

---

**Important :** ne commitez jamais `.env.local` (il est dans `.gitignore`). Le mot de passe reste uniquement sur votre machine.
