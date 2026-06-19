/**
 * Page d'accueil : hero + catégories vedettes + produits populaires.
 * Inspiration : layout "Nest" épuré, sans surcharge graphique.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Produit, CategorieProduit } from '../types';
import { listProduits } from '../api/produits';
import { listCategories } from '../api/categories';
import ProductCard from '../components/ui/ProductCard';

export default function Home() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<CategorieProduit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Chargement en parallèle des produits + catégories
        const [p, c] = await Promise.all([listProduits(), listCategories()]);
        if (!mounted) return;
        setProduits(p);
        setCategories(c);
      } catch (e: any) {
        if (mounted) setError("Impossible de charger les données. Vérifiez que le backend est démarré.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="border-b border-stone-200 bg-gradient-to-br from-brand-50 via-white to-stone-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="badge mb-4 bg-brand-100 text-brand-800">Nouveau · Marketplace locale</span>
            <h1 className="mb-5 text-4xl font-semibold leading-tight text-stone-900 md:text-5xl">
              Achetez et vendez près de chez vous,&nbsp;
              <span className="text-brand-700">en toute simplicité.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-stone-600">
              Découvrez des produits proposés par notre communauté de vendeurs.
              Publiez vos articles en quelques clics, fixez votre prix, contactez les acheteurs directement.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/produits" className="btn-primary">Explorer la boutique</Link>
              <Link to="/register" className="btn-secondary">Devenir vendeur</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-brand-200/40 blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-brand-200 to-brand-400" />
                <div className="mt-10 aspect-[4/5] rounded-2xl bg-gradient-to-br from-stone-200 to-stone-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CATÉGORIES ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-stone-900">Catégories</h2>
            <p className="mt-1 text-stone-500">Parcourez les rayons en un coup d&apos;œil.</p>
          </div>
          <Link to="/produits" className="text-sm font-semibold text-brand-700 hover:underline">
            Tout voir →
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={6} aspect="aspect-square" />
        ) : categories.length === 0 ? (
          <EmptyState text="Aucune catégorie disponible pour le moment." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c.idcategorie_produit}
                to={`/produits?categorie=${c.idcategorie_produit}`}
                className="group card flex aspect-square flex-col items-center justify-center p-4 text-center transition hover:shadow-cardHover"
              >
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <span className="font-display text-xl font-semibold">
                    {c.nomCategorieproduit?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-medium text-stone-900 group-hover:text-brand-700">
                  {c.nomCategorieproduit}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---------- PRODUITS POPULAIRES ---------- */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-stone-900">Produits récents</h2>
            <p className="mt-1 text-stone-500">Les dernières annonces publiées sur Assigame.</p>
          </div>
          <Link to="/produits" className="text-sm font-semibold text-brand-700 hover:underline">
            Voir tout →
          </Link>
        </div>

        {error && <ErrorBlock message={error} />}

        {loading ? (
          <SkeletonGrid count={8} aspect="aspect-[4/3]" />
        ) : produits.length === 0 ? (
          <EmptyState text="Aucun produit n'a encore été publié." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {produits.slice(0, 8).map((p) => (
              <ProductCard key={p.id} produit={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/* ---------- Sous-composants utilitaires ---------- */

function SkeletonGrid({ count, aspect }: { count: number; aspect: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`card ${aspect} animate-pulse bg-stone-100`} />
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="card flex items-center justify-center py-16 text-stone-500">
      {text}
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}
