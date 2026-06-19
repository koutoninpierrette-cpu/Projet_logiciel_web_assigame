/**
 * Page Détail produit.
 * Note : le backend ne propose pas GET /api/produit/{id}.
 * On récupère donc la liste et on filtre par id (suffisant pour la taille du projet).
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listProduits } from '../api/produits';
import { Produit } from '../types';
import { formatPrice } from '../lib/utils';
import { resolveImageUrl } from '../api/axios';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await listProduits();
        const found = all.find((p) => String(p.id) === id) ?? null;
        setProduit(found);
        if (!found) setError('Produit introuvable.');
      } catch {
        setError('Impossible de charger le produit.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="card aspect-square animate-pulse bg-stone-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-stone-100" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-stone-100" />
            <div className="h-24 animate-pulse rounded bg-stone-100" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !produit) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">{error || 'Produit introuvable'}</h1>
        <Link to="/produits" className="btn-primary mt-6 inline-flex">
          Retour à la boutique
        </Link>
      </section>
    );
  }

  const img = resolveImageUrl(produit.imageUrl);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <nav className="mb-6 text-sm text-stone-500">
        <Link to="/" className="hover:text-brand-700">Accueil</Link>
        <span className="mx-2">/</span>
        <Link to="/produits" className="hover:text-brand-700">Boutique</Link>
        <span className="mx-2">/</span>
        <span className="text-stone-700">{produit.nom}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* ---------- Image ---------- */}
        <div className="card overflow-hidden">
          <div className="aspect-square w-full bg-stone-100">
            {img ? (
              <img src={img} alt={produit.nom} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400">Pas d&apos;image</div>
            )}
          </div>
        </div>

        {/* ---------- Infos ---------- */}
        <div>
          {produit.categorie?.nomCategorieproduit && (
            <span className="badge mb-3 bg-brand-100 text-brand-800">
              {produit.categorie.nomCategorieproduit}
            </span>
          )}
          <h1 className="font-display text-4xl font-semibold leading-tight text-stone-900">{produit.nom}</h1>

          <div className="mt-4 text-3xl font-semibold text-brand-700">{formatPrice(produit.prix)}</div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-stone-700">
            {produit.description || 'Aucune description fournie par le vendeur.'}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary">Contacter le vendeur</button>
            <Link to="/produits" className="btn-secondary">Voir d&apos;autres produits</Link>
          </div>

          <div className="mt-10 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
            Conseil : vérifiez toujours l&apos;article avant de payer et privilégiez les remises en main propre.
          </div>
        </div>
      </div>
    </section>
  );
}
