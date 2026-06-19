# Assigame – Frontend React + TypeScript + Vite

Frontend prêt-à-l'emploi pour le backend Spring Boot **Assigame**.
Look épuré inspiré du style « Nest » (vert sobre), code commenté en français, organisation simple.

---

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
yarn install      # ou : npm install

# 2. Configurer l'URL du backend
cp .env.example .env
# édite .env si ton backend n'est pas sur http://localhost:8080

# 3. Lancer le dev server (port 5173, déjà autorisé par ton CORS)
yarn dev
```

---

## 🔁 Copier dans VOTRE projet Vite existant

Tous les fichiers nécessaires sont dans **ce dossier**. Pour les intégrer à votre projet existant :

1. **Recopier le dossier `src/`** entier (écrase l'ancien).
2. Recopier (ou fusionner) :
   - `package.json` → vérifie que tu as `axios`, `react-router-dom` (`yarn add axios react-router-dom`)
   - `tailwind.config.js`, `postcss.config.js`, `index.html`
   - `.env.example` (et créer ton `.env`)
3. Lance `yarn install` puis `yarn dev`.

---

## 🗂 Structure

```
src/
├── api/                  # Clients Axios pour chaque ressource backend
│   ├── axios.ts          # Instance + intercepteur JWT
│   ├── auth.ts           # /api/auth/login & /register
│   ├── produits.ts       # CRUD /api/produit
│   ├── categories.ts     # CRUD /api/categorieproduit
│   ├── utilisateurs.ts   # CRUD /api/utilisateur (admin)
│   ├── typeUtilisateur.ts# CRUD /api/typeutilisateur (admin)
│   └── upload.ts         # POST /api/upload (multipart)
│
├── components/
│   ├── layout/           # Header, Footer, Layout
│   ├── ui/               # ProductCard
│   └── ProtectedRoute.tsx
│
├── context/
│   └── AuthContext.tsx   # Token JWT + user courant
│
├── pages/
│   ├── Home.tsx          # Accueil (hero + catégories + récents)
│   ├── ProductList.tsx   # Catalogue + recherche + filtre catégorie
│   ├── ProductDetail.tsx # Détail d'un produit
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── NotFound.tsx
│   └── dashboard/
│       ├── DashboardLayout.tsx
│       ├── VendorProducts.tsx     # Vendeur : CRUD ses annonces
│       ├── AdminProducts.tsx      # Admin : supprimer toute annonce
│       ├── AdminUsers.tsx         # Admin : liste/suspendre/supprimer
│       ├── AdminCategories.tsx    # Admin : CRUD catégories
│       └── AdminTypeUtilisateur.tsx
│
├── types/index.ts        # Tous les types TS alignés avec les entités Java
├── lib/utils.ts          # Helpers (prix, troncature, WhatsApp)
├── index.css             # Tailwind + composants `.btn-primary` etc.
├── main.tsx              # Bootstrap React + BrowserRouter
└── App.tsx               # Routes
```

---

## 👥 Rôles & Permissions

| Rôle      | Accès |
|-----------|-------|
| **ACHETEUR** | Accueil, boutique, détail produit, son profil |
| **VENDEUR**  | Tout + `/vendeur` (créer / modifier / supprimer des annonces, upload image) |
| **ADMIN**    | Tout + `/admin/*` (produits, catégories, utilisateurs, types) |

Le rôle est lu depuis `AuthResponse.typeUtilisateur` retourné par le backend et normalisé dans `types/index.ts → normalizeRole()`.

> ⚠️ La sécurité **réelle** doit être appliquée côté Spring Boot. Ce frontend ne fait que masquer/protéger les routes côté UI.

---

## 🔌 Endpoints backend utilisés

| Méthode | URL | Usage |
|---------|-----|-------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login`    | Connexion |
| GET  | `/api/produit/list`  | Liste produits |
| POST | `/api/produit/add`   | Création produit (vendeur/admin) |
| PUT  | `/api/produit/update/{id}` | Modification |
| DELETE | `/api/produit/delete/{id}` | Suppression |
| GET / POST / PUT / DELETE | `/api/categorieproduit/...` | Catégories |
| GET / POST / PUT / DELETE | `/api/utilisateur/...` | Utilisateurs (admin) |
| GET / POST / PUT / DELETE | `/api/typeutilisateur/...` | Types (admin) |
| POST | `/api/upload` | Upload image (multipart `file`) |

---

## ⚠️ Limites du backend actuel (à savoir)

1. **`Produit` n'a pas de champ `vendeur_id`** : impossible de filtrer les annonces par vendeur côté backend.
   → Le tableau de bord vendeur affiche actuellement **tous** les produits.
   → Pour corriger : ajouter `@ManyToOne private Utilisateur vendeur;` dans l'entité `Produit`.
2. **Pas d'endpoint `GET /api/produit/{id}`** : la page Détail charge la liste complète puis filtre.
   → Recommandé : ajouter un endpoint dédié dans `ProduitController`.
3. **`Signalement` n'a pas de contrôleur exposé** → fonctionnalité non câblée dans le front.

---

## 🎨 Personnalisation rapide

- **Couleur de marque** : `tailwind.config.js → theme.extend.colors.brand`
- **Polices** : changer le lien Google Fonts dans `index.html` + `tailwind.config.js`
- **Devise** : `src/lib/utils.ts → formatPrice()` (par défaut : XOF / FCFA)
