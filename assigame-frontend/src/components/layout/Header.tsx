/**
 * En-tête principal du site Assigame.
 * - Logo + Nom + barre de recherche + navigation rôle-aware.
 */
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Recherche → on passe en query string vers /produits
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/produits?q=${encodeURIComponent(q)}` : '/produits');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      {/* Bandeau utilitaire */}
      <div className="hidden border-b border-stone-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-stone-500">
          <span>Bienvenue sur Assigame — vendez et achetez près de chez vous.</span>
          <div className="flex items-center gap-4">
            {user ? (
              <span>
                Connecté en tant que <strong className="text-stone-700">{user.nom}</strong>
                {role && <span className="ml-1 text-brand-600">· {role}</span>}
              </span>
            ) : (
              <>
                <Link to="/login" className="hover:text-brand-700">Connexion</Link>
                <span>·</span>
                <Link to="/register" className="hover:text-brand-700">Inscription</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Barre principale */}
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        {/* Logo + nom */}
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-display text-lg font-bold text-white">
            A
          </span>
          <span className="font-display text-2xl font-semibold text-stone-900">Assigame</span>
        </Link>

        {/* Recherche */}
        <form onSubmit={onSearch} className="hidden flex-1 md:block">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit, une catégorie…"
              className="input pl-11"
              aria-label="Recherche produits"
            />
            <svg
              className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </form>

        {/* Navigation droite */}
        <nav className="flex items-center gap-3">
          <NavLink
            to="/produits"
            className={({ isActive }) =>
              `hidden text-sm font-medium md:inline ${isActive ? 'text-brand-700' : 'text-stone-600 hover:text-stone-900'}`
            }
          >
            Boutique
          </NavLink>

          {/* Liens spécifiques au rôle */}
          {role === 'VENDEUR' && (
            <NavLink to="/vendeur" className="hidden text-sm font-medium text-stone-600 hover:text-stone-900 md:inline">
              Mes annonces
            </NavLink>
          )}
          {role === 'ADMIN' && (
            <NavLink to="/admin" className="hidden text-sm font-medium text-stone-600 hover:text-stone-900 md:inline">
              Administration
            </NavLink>
          )}

          {user ? (
            <>
              <button onClick={logout} className="btn-secondary !py-2">
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2">
                Connexion
              </Link>
              <Link to="/register" className="btn-primary !py-2">
                S&apos;inscrire
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Recherche mobile */}
      <form onSubmit={onSearch} className="border-t border-stone-100 px-4 py-3 md:hidden">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="input"
        />
      </form>
    </header>
  );
}
