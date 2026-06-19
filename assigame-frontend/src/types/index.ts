/**
 * Types TypeScript correspondant aux entités du backend Spring Boot.
 * Tous les noms de champs respectent EXACTEMENT ceux exposés par l'API.
 */

// ------------- Authentification -------------
export interface AuthRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  numeroWhatsapp: string;
  typeUtilisateurId: number; // id du TypeUtilisateur choisi
}

export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  typeUtilisateur: string; // ex: "ADMIN" | "VENDEUR" | "ACHETEUR"
}

// ------------- TypeUtilisateur -------------
export interface TypeUtilisateur {
  id_typeutilisateur: number;
  nomTypeutilisateur: string;
  descriptionTypeutilisateur?: string;
}

// ------------- Catégorie produit -------------
export interface CategorieProduit {
  idcategorie_produit: number;
  nomCategorieproduit: string;
  description?: string;
}

// ------------- Produit -------------
export interface Produit {
  id: number;
  nom: string;
  description?: string;
  prix: number;
  imageUrl?: string;
  categorie?: CategorieProduit | null;
}

// ------------- Utilisateur -------------
export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  numeroWhatsapp?: string;
  statut: string; // ACTIF | SUSPENDU | BLOQUE
  dateInscription?: string;
  typeUtilisateur?: TypeUtilisateur | null;
}

// ------------- Rôles applicatifs -------------
export type Role = 'ADMIN' | 'VENDEUR' | 'ACHETEUR';

/**
 * Normalise la chaîne de rôle renvoyée par le backend
 * (le backend renvoie le nomTypeutilisateur, ex: "Admin", "vendeur" ...).
 */
export function normalizeRole(raw?: string | null): Role | null {
  if (!raw) return null;
  const up = raw.trim().toUpperCase();
  if (up.includes('ADMIN')) return 'ADMIN';
  if (up.includes('VEND')) return 'VENDEUR';
  if (up.includes('ACH')) return 'ACHETEUR';
  return null;
}
