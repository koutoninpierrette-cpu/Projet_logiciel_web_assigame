/**
 * Carte produit utilisée dans la grille de la boutique.
 */
import { Link } from 'react-router-dom';
import { Produit } from '../../types';
import { formatPrice, truncate } from '../../lib/utils';
import { resolveImageUrl } from '../../api/axios';

interface Props {
  produit: Produit;
}

export default function ProductCard({ produit }: Props) {
  const img = resolveImageUrl(produit.imageUrl);

  return (
    <Link
      to={`/produits/${produit.id}`}
      className="card group block overflow-hidden transition hover:shadow-cardHover"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {img ? (
          <img
            src={img}
            alt={produit.nom}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            <span className="text-sm">Pas d&apos;image</span>
          </div>
        )}
        {produit.categorie?.nomCategorieproduit && (
          <span className="badge absolute left-3 top-3 bg-white/95 text-stone-700 shadow-sm">
            {produit.categorie.nomCategorieproduit}
          </span>
        )}
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="font-display text-lg font-semibold text-stone-900 line-clamp-1">{produit.nom}</h3>
        <p className="min-h-[2.5rem] text-sm text-stone-500">{truncate(produit.description, 70)}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-brand-700">{formatPrice(produit.prix)}</span>
          <span className="text-xs font-medium text-stone-500 underline-offset-4 group-hover:text-brand-700 group-hover:underline">
            Voir le détail
          </span>
        </div>
      </div>
    </Link>
  );
}
