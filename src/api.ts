const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081'

export type ApiCategorie = {
  idcategorie_produit: number
  nom_categorieproduit: string
  description: string | null
}

export type ApiProduit = {
  id_produit: number
  nom_produit: string
  description: string | null
  prix: number
  image: string | null
  date_ajout: string
  statut: string
  categorieProduit: ApiCategorie | null
  boutique: ApiBoutique | null
}

export type ApiUtilisateur = {
  id_utilisateur: number
  Nom: string
  Prenom: string
  Email: string
  Login: string
  telephone?: string | null
  statut: string
}

export type ApiBoutique = {
  id_boutique: number
  nom_boutique: string
  description: string | null
  logo: string | null
  date_creation: string
  statut: string
  utilisateur?: ApiUtilisateur | null
}

export type SignupPayload = {
  Nom: string
  Prenom: string
  Email: string
  Motdepasse: string
  Login: string
}

export type LoginPayload = {
  email: string
  motdepasse: string
}

export type CreateBoutiquePayload = {
  nom_boutique: string
  description?: string
  logo?: string
  utilisateur: { id_utilisateur: number }
}

export type CreateProduitPayload = {
  nom_produit: string
  description?: string
  prix: number
  image?: string
  date_ajout: string
  statut: string
  categorieProduit: { idcategorie_produit: number }
  utilisateur: { id_utilisateur: number }
  boutique: { id_boutique: number }
}

export class ApiError extends Error {}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(body?.message ?? `Erreur ${response.status}`)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function fetchCategories(): Promise<ApiCategorie[]> {
  return request('/api/categorieproduit/list')
}

export function fetchProduits(): Promise<ApiProduit[]> {
  return request('/api/produit/list')
}

export function fetchBoutiques(): Promise<ApiBoutique[]> {
  return request('/api/boutique/list')
}

export function fetchBoutiqueByUser(idUtilisateur: number): Promise<ApiBoutique | undefined> {
  return request(`/api/boutique/by-user/${idUtilisateur}`)
}

export function createBoutique(payload: CreateBoutiquePayload): Promise<ApiBoutique> {
  return request('/api/boutique/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createProduit(payload: CreateProduitPayload): Promise<ApiProduit> {
  return request('/api/produit/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(body?.message ?? `Erreur ${response.status}`)
  }

  const data = (await response.json()) as { url: string }
  return `${API_BASE}${data.url}`
}

export function fetchUtilisateurs(): Promise<ApiUtilisateur[]> {
  return request('/api/utilisateur/list')
}

export function fetchUtilisateur(id: number): Promise<ApiUtilisateur> {
  return request(`/api/utilisateur/${id}`)
}

export function updateUtilisateur(id: number, payload: Partial<ApiUtilisateur>): Promise<ApiUtilisateur> {
  return request(`/api/utilisateur/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function signup(payload: SignupPayload): Promise<ApiUtilisateur> {
  return request('/api/utilisateur/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function login(payload: LoginPayload): Promise<ApiUtilisateur> {
  return request('/api/utilisateur/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function deleteUtilisateur(id: number): Promise<void> {
  return request(`/api/utilisateur/delete/${id}`, { method: 'DELETE' })
}

export function deleteBoutique(id: number): Promise<void> {
  return request(`/api/boutique/delete/${id}`, { method: 'DELETE' })
}

export function deleteProduit(id: number): Promise<void> {
  return request(`/api/produit/delete/${id}`, { method: 'DELETE' })
}

export type CategoriePayload = {
  nom_categorieproduit: string
  description?: string
}

export function createCategorie(payload: CategoriePayload): Promise<ApiCategorie> {
  return request('/api/categorieproduit/add', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateCategorie(id: number, payload: CategoriePayload): Promise<ApiCategorie> {
  return request(`/api/categorieproduit/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteCategorie(id: number): Promise<void> {
  return request(`/api/categorieproduit/delete/${id}`, { method: 'DELETE' })
}
