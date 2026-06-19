/**
 * Layout des espaces Vendeur / Admin : sidebar + contenu via <Outlet>.
 */
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
  title: string;
}

export default function DashboardLayout({ title }: Props) {
  const { role, user } = useAuth();

  // Construction du menu en fonction du rôle
  const links: { to: string; label: string }[] = [];
  if (role === 'ADMIN') {
    links.push(
      { to: '/admin/produits', label: 'Produits' },
      { to: '/admin/categories', label: 'Catégories' },
      { to: '/admin/utilisateurs', label: 'Utilisateurs' },
      { to: '/admin/types-utilisateur', label: 'Types utilisateur' }
    );
  } else if (role === 'VENDEUR') {
    links.push({ to: '/vendeur', label: 'Mes annonces' });
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8">
        <p className="text-sm font-medium text-brand-700">{role}</p>
        <h1 className="font-display text-3xl font-semibold text-stone-900">{title}</h1>
        {user && <p className="mt-1 text-stone-500">Connecté en tant que {user.nom}</p>}
      </header>

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside>
          <nav className="card overflow-hidden">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  `block border-b border-stone-100 px-4 py-3 text-sm font-medium last:border-b-0 ${
                    isActive ? 'bg-brand-50 text-brand-800' : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </section>
  );
}
