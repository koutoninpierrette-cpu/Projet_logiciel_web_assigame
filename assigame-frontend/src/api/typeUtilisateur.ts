/**
 * CRUD Types Utilisateur (réservé Admin).
 * Endpoints backend :
 *   GET    /api/typeutilisateur/list
 *   POST   /api/typeutilisateur/add
 *   PUT    /api/typeutilisateur/update/{id}
 *   DELETE /api/typeutilisateur/delete/{id}
 */
import { api } from './axios';
import { TypeUtilisateur } from '../types';

export async function listTypesUtilisateur(): Promise<TypeUtilisateur[]> {
  const { data } = await api.get<TypeUtilisateur[]>('/api/typeutilisateur/list');
  return data;
}

export async function createTypeUtilisateur(t: Partial<TypeUtilisateur>): Promise<TypeUtilisateur> {
  const { data } = await api.post<TypeUtilisateur>('/api/typeutilisateur/add', t);
  return data;
}

export async function updateTypeUtilisateur(id: number, t: Partial<TypeUtilisateur>): Promise<TypeUtilisateur> {
  const { data } = await api.put<TypeUtilisateur>(`/api/typeutilisateur/update/${id}`, t);
  return data;
}

export async function deleteTypeUtilisateur(id: number): Promise<void> {
  await api.delete(`/api/typeutilisateur/delete/${id}`);
}
