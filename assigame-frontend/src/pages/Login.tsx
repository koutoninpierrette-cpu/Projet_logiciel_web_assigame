/**
 * Page Connexion.
 */
import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, motDePasse });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Bon retour</h1>
        <p className="mt-2 text-stone-500">Connectez-vous pour gérer vos annonces et vos achats.</p>
      </div>

      <form onSubmit={onSubmit} className="card w-full space-y-4 p-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            className="input"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="text-center text-sm text-stone-500">
          Pas encore inscrit ?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </section>
  );
}
