/**
 * CRUD Catégories de produits.
 * Endpoints backend :
 *   GET    /api/categorieproduit/list
 *   POST   /api/categorieproduit/add
 *   PUT    /api/categorieproduit/update/{id}
 *   DELETE /api/categorieproduit/delete/{id}
 */
import { api } from './axios';
import { CategorieProduit } from '../types';

export async function listCategories(): Promise<CategorieProduit[]> {
  const { data } = await api.get<CategorieProduit[]>('/api/categorieproduit/list');
  return data;
}

export async function createCategorie(c: Partial<CategorieProduit>): Promise<CategorieProduit> {
  const { data } = await api.post<CategorieProduit>('/api/categorieproduit/add', c);
  return data;
}

export async function updateCategorie(id: number, c: Partial<CategorieProduit>): Promise<CategorieProduit> {
  const { data } = await api.put<CategorieProduit>(`/api/categorieproduit/update/${id}`, c);
  return data;
}

export async function deleteCategorie(id: number): Promise<void> {
  await api.delete(`/api/categorieproduit/delete/${id}`);
}
