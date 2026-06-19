/**
 * Upload d'image.
 * Endpoint backend : POST /api/upload  (multipart/form-data, champ "file")
 * Retourne une string du type "/uploads/uuid_nom.jpg"
 */
import { api } from './axios';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<string>('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // ex: "/uploads/xxx_photo.jpg"
}
