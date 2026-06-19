/**
 * CRUD Utilisateurs (réservé Admin).
 * Endpoints backend :
 *   GET    /api/utilisateur/list
 *   POST   /api/utilisateur/add
 *   PUT    /api/utilisateur/update/{id}
 *   DELETE /api/utilisateur/delete/{id}
 */
import { api } from './axios';
import { Utilisateur } from '../types';

export async function listUtilisateurs(): Promise<Utilisateur[]> {
  const { data } = await api.get<Utilisateur[]>('/api/utilisateur/list');
  return data;
}

export async function createUtilisateur(u: Partial<Utilisateur>): Promise<Utilisateur> {
  const { data } = await api.post<Utilisateur>('/api/utilisateur/add', u);
  return data;
}

export async function updateUtilisateur(id: number, u: Partial<Utilisateur>): Promise<Utilisateur> {
  const { data } = await api.put<Utilisateur>(`/api/utilisateur/update/${id}`, u);
  return data;
}

export async function deleteUtilisateur(id: number): Promise<void> {
  await api.delete(`/api/utilisateur/delete/${id}`);
}
