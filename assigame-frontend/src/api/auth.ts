/**
 * Appels d'API liés à l'authentification.
 * Endpoints backend :
 *   POST /api/auth/login
 *   POST /api/auth/register
 */
import { api } from './axios';
import { AuthRequest, AuthResponse, RegisterRequest } from '../types';

export async function login(req: AuthRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', req);
  return data;
}

export async function register(req: RegisterRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', req);
  return data;
}
