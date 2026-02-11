# Guide de connexion Firebase – Site Mariage

Ce guide explique comment connecter votre projet Next.js au backend Firebase (Firestore) pour le site souvenir de mariage.

---

## 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/).
2. Cliquez sur **« Ajouter un projet »** (ou **« Créer un projet »**).
3. Donnez un nom au projet (ex. `site-mariage-2025`) puis **Suivant**.
4. Désactivez Google Analytics si vous n’en avez pas besoin, puis **Créer le projet**.

---

## 2. Enregistrer une application Web

1. Dans la page d’accueil du projet, cliquez sur l’icône **Web** `</>`.
2. Donnez un **surnom** à l’app (ex. `Site mariage`).
3. Ne cochez pas Firebase Hosting pour l’instant.
4. Cliquez sur **« Enregistrer l’application »**.
5. Une configuration du type ci-dessous s’affiche :

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

Vous utiliserez ces valeurs dans l’étape suivante.

---

## 3. Configurer les variables d’environnement

1. À la racine du projet, copiez le fichier d’exemple :

   ```bash
   cp .env.local.example .env.local
   ```

2. Ouvrez **`.env.local`** et remplissez la partie Firebase avec les valeurs de l’étape 2 :

   ```env
   # Firebase (à remplir avec les valeurs de la console)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-projet
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
   ```

3. Redémarrez le serveur de développement :

   ```bash
   npm run dev
   ```

Les clés préfixées par `NEXT_PUBLIC_` sont exposées côté client (nécessaire pour que le navigateur se connecte à Firebase).

---

## 4. Activer Firestore

1. Dans le menu de gauche de la [Firebase Console](https://console.firebase.google.com/), ouvrez **« Build »** → **« Firestore Database »**.
2. Cliquez sur **« Créer une base de données »**.
3. Choisissez **« Démarrer en mode test »** pour commencer (vous pourrez durcir les règles plus tard).
4. Sélectionnez une **région** (ex. `europe-west1` pour la France).
5. Validez avec **« Activer »**.

---

## 5. Règles de sécurité Firestore

En **mode test**, tout le monde peut lire/écrire pendant 30 jours. Pour la production, utilisez des règles adaptées.

1. Dans Firestore, allez dans l’onglet **« Règles »**.
2. Remplacez le contenu par les règles ci-dessous (elles autorisent lecture/écriture pour le site ; à affiner selon vos besoins) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Médias : lecture pour tous si approuvé, écriture pour tous (les mariés modèrent via le dashboard)
    match /media/{mediaId} {
      allow read: if resource == null || resource.data.isApproved == true;
      allow create: if true;
      allow update, delete: if true;
      match /likes/{likeId} {
        allow read, write: if true;
      }
    }

    // Commentaires : lecture si approuvé, création par les visiteurs
    match /comments/{commentId} {
      allow read: if resource.data.isApproved == true;
      allow create: if true;
      allow update, delete: if false;
    }

    // Playlist : lecture pour tous
    match /playlist/{itemId} {
      allow read: if true;
      allow write: if true;
    }

    // Livre d'or : lecture si approuvé, création par les visiteurs
    match /guestbook/{entryId} {
      allow read: if resource.data.isApproved == true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

3. Cliquez sur **« Publier »**.

> **Note :** Ces règles permettent des écritures larges (create/update/delete sur `media`). Pour un site public, vous pouvez restreindre plus tard (par exemple avec Firebase Auth pour le dashboard).

---

## 6. Déployer les index Firestore

Certaines requêtes du site ont besoin d’**index composites**. Deux possibilités.

### Option A : Firebase CLI (recommandé)

1. Installez Firebase CLI si besoin :

   ```bash
   npm install -g firebase-tools
   ```

2. Connectez-vous :

   ```bash
   firebase login
   ```

3. À la racine du projet, initialisez Firebase (si pas déjà fait) :

   ```bash
   firebase init firestore
   ```

   - Choisissez **« Use an existing project »** et sélectionnez votre projet.
   - Fichier de règles : gardez `firestore.rules`.
   - Fichier d’index : indiquez **`firestore.indexes.json`** (déjà présent dans le projet).

4. Déployez uniquement les index :

   ```bash
   firebase deploy --only firestore:indexes
   ```

### Option B : Création manuelle

Si une requête échoue, la console Firebase (ou l’erreur dans le navigateur) peut vous proposer un **lien pour créer l’index**. Cliquez dessus : l’index sera créé automatiquement. Répétez pour chaque requête qui en a besoin.

---

## 7. Structure des données Firestore

Le site utilise les collections suivantes. Vous n’avez pas besoin de les créer à la main : elles sont créées au moment des premières écritures.

| Collection       | Description |
|-----------------|-------------|
| `media`         | Photos et vidéos. Champs : `coupleId`, `type` (image/video), `cloudinaryId`, `moment`, `createdAt`, `likesCount`, `uploadedBy`, `isApproved`. Sous-collection `media/{id}/likes/{visitorId}` pour les likes. |
| `comments`      | Commentaires sur un média. Champs : `mediaId`, `visitorId`, `authorName`, `content`, `createdAt`, `isApproved`. |
| `playlist`      | Titres YouTube. Champs : `title`, `youtubeVideoId`, `moment`, `order`. |
| `guestbook`     | Messages du livre d’or. Champs : `visitorId`, `authorName`, `content`, `createdAt`, `isApproved`. |

Pour ajouter des musiques à la **playlist** à la main :

1. Firestore → **« Démarrer une collection »** → ID de collection : **`playlist`**.
2. Ajoutez des documents avec par exemple :
   - `title` (string) : "Notre chanson"
   - `youtubeVideoId` (string) : l’ID de la vidéo YouTube (ex. `dQw4w9WgXcQ`)
   - `moment` (string) : `preparatifs`, `ceremonie` ou `soiree`
   - `order` (number) : 0, 1, 2… pour l’ordre d’affichage

---

## 8. Vérifier la connexion

1. Lancez le site : `npm run dev`.
2. Ouvrez [http://localhost:3000](http://localhost:3000).
3. Allez sur une section qui lit Firestore (galerie, playlist, livre d’or).
4. Dans la console navigateur (F12), vous ne devez pas voir d’erreur Firebase.
5. Dans la Firebase Console → Firestore → **« Données »**, vous devriez voir des collections apparaître après les premières actions (likes, commentaires, etc.).

---

## 9. Dépannage

| Problème | Piste de solution |
|----------|-------------------|
| « Missing or insufficient permissions » | Vérifiez les **règles Firestore** (étape 5) et que les champs utilisés dans les requêtes correspondent aux règles. |
| « The query requires an index » | Déployez les index (étape 6) ou suivez le lien fourni dans l’erreur pour créer l’index. |
| Rien ne s’affiche / pas de données | Vérifiez que `.env.local` est bien rempli, que le serveur a été redémarré après modification des variables, et que vous êtes bien sur le bon projet Firebase. |
| `db is null` ou erreur côté serveur | La connexion Firebase est faite uniquement côté client (`typeof window !== "undefined"`). Les pages qui appellent Firestore doivent s’exécuter côté client (composants avec `"use client"` ou `useEffect`). |

---

## 10. Résumé des étapes

1. Créer un projet Firebase.
2. Enregistrer une app Web et récupérer la config.
3. Remplir `.env.local` avec les 6 variables Firebase.
4. Activer Firestore (mode test puis règles de production).
5. Mettre en place les règles de sécurité Firestore.
6. Déployer les index avec `firebase deploy --only firestore:indexes`.
7. Lancer le site et vérifier que les données s’affichent et se créent correctement.

Une fois ces étapes faites, la connexion avec Firebase est en place pour le site mariage.
