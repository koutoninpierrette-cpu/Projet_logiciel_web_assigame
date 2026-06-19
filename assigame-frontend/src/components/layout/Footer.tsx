/** Pied de page sobre, sans icônes parasites. */
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-display text-lg font-bold text-white">A</span>
            <span className="font-display text-xl font-semibold">Assigame</span>
          </div>
          <p className="text-sm leading-relaxed text-stone-500">
            La marketplace simple et fiable pour acheter et vendre vos articles près de chez vous.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-stone-900">Boutique</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li><Link to="/produits" className="hover:text-brand-700">Tous les produits</Link></li>
            <li><Link to="/produits" className="hover:text-brand-700">Catégories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-stone-900">Compte</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li><Link to="/login" className="hover:text-brand-700">Connexion</Link></li>
            <li><Link to="/register" className="hover:text-brand-700">Inscription</Link></li>
            <li><Link to="/vendeur" className="hover:text-brand-700">Devenir vendeur</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-stone-900">À propos</h4>
          <ul className="space-y-2 text-sm text-stone-600">
            <li>Projet ESGIS 2026</li>
            <li>Marketplace pédagogique</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-100">
        <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-stone-500">
          © {new Date().getFullYear()} Assigame. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
