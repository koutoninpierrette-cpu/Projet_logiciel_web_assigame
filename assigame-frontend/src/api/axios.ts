/**
 * Instance Axios centrale pour parler au backend Spring Boot.
 * - Ajoute automatiquement le token JWT à chaque requête.
 * - Gère la déconnexion automatique si le token expire (401).
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// URL de base, lue depuis le fichier .env (VITE_API_URL)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur de requête : injecte le JWT s'il est présent
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('assigame_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : si 401 -> on nettoie le storage et on redirige
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('assigame_token');
      localStorage.removeItem('assigame_user');
      // Pas de redirection forcée ici pour ne pas casser les pages publiques
    }
    return Promise.reject(error);
  }
);

/**
 * Construit l'URL absolue d'une image upload renvoyée par le backend
 * (ex: "/uploads/uuid_photo.jpg" -> "http://localhost:8080/uploads/uuid_photo.jpg")
 */
export function resolveImageUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${baseURL}${path.startsWith('/') ? '' : '/'}${path}`;
}
