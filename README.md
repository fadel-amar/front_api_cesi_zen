# 🧘‍♂️ CesiZen – Interface Utilisateur (Front-end)

> **Application de gestion du bien-être au sein du campus CESI** : chaque utilisateur peut consulter, enregistrer et marquer comme favori des activités de relaxation.
> Ce projet utilise **Vue 3 + TypeScript + Vite** et communique avec une **API .NET**.

---

## 🚀 Fonctionnalités principales

* 🔐 Authentification (connexion, inscription)
* 👤 Gestion du profil (mise à jour login, mot de passe, suppression de compte)
* 🧘‍♀️ Parcours d’activités bien-être
* ⭐ Ajout aux **favoris** ou **enregistrer pour plus tard**
* ⚙️ Interface d'administration pour les utilisateurs, activités, pages

---

## 🛠️ Installation du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/fadel-amar/cesi-zen-front.git
cd cesi-zen-front
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Créer un fichier `.env` à la racine

```env
VITE_API_BASE_URL=https://localhost:7044/api
VITE_URL_MEDIA=https://localhost:7044
```

Ces variables permettent :

* **`VITE_API_BASE_URL`** : d’indiquer l’URL de base de l’API CesiZen (développée en .NET)
* **`VITE_URL_MEDIA`** : d’accéder aux fichiers médias (images, vidéos, etc.) exposés par l'API

### 4. Lancer le projet en développement

```bash
npm run dev
```

### 5. Compiler pour la production

```bash
npm run build
```

### 6. Lancer un serveur local de preview

```bash
npm run preview
```

---

## 🧩 Technologies utilisées

* **Vue 3** (Composition API avec `<script setup>`)
* **TypeScript**
* **Vue Router**
* **Tailwind CSS**
* **FontAwesome**
* **Vite** (pour un build rapide)
* **Axios** (pour les requêtes HTTP)
* **Quill** (éditeur riche)

---

## 🔗 Lien vers l’API .NET

> L’API REST utilisée dans cette application est développée en .NET Core.
> 👉 [Lien vers le dépôt API CesiZen](https://github.com/ton-utilisateur/cesi-zen-api)

---

## ✨ Aperçu de l'architecture

```bash
📁 src
├── components          # Composants réutilisables (modals, layouts)
├── views               # Pages principales de l’application
├── router              # Configuration des routes Vue Router
├── services            # Fonctions d’appel à l’API (auth, users, activités, etc.)
├── assets              # Images, icônes, fichiers statiques
└── App.vue             # Point d’entrée principal
```

---

## 🧑‍💻 Auteur

* [Fadel-Amar](https://github.com/fadel-amar)
