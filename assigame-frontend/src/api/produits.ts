/**
 * CRUD Produits.
 * Endpoints backend :
 *   GET    /api/produit/list
 *   POST   /api/produit/add
 *   PUT    /api/produit/update/{id}
 *   DELETE /api/produit/delete/{id}
 */
import { api } from './axios';
import { Produit } from '../types';

export async function listProduits(): Promise<Produit[]> {
  const { data } = await api.get<Produit[]>('/api/produit/list');
  return data;
}

export async function createProduit(p: Partial<Produit>): Promise<Produit> {
  const { data } = await api.post<Produit>('/api/produit/add', p);
  return data;
}

export async function updateProduit(id: number, p: Partial<Produit>): Promise<Produit> {
  const { data } = await api.put<Produit>(`/api/produit/update/${id}`, p);
  return data;
}

export async function deleteProduit(id: number): Promise<void> {
  await api.delete(`/api/produit/delete/${id}`);
}
