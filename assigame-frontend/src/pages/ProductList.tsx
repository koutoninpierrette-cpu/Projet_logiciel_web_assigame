/**
 * Page Liste produits avec recherche + filtre par catégorie.
 * Query params supportés : ?q=texte&categorie=ID
 */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Produit, CategorieProduit } from '../types';
import { listProduits } from '../api/produits';
import { listCategories } from '../api/categories';
import ProductCard from '../components/ui/ProductCard';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<CategorieProduit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État local synchronisé avec l'URL
  const q = searchParams.get('q') ?? '';
  const categorieId = searchParams.get('categorie');
  const [search, setSearch] = useState(q);

  useEffect(() => {
    (async () => {
      try {
        const [p, c] = await Promise.all([listProduits(), listCategories()]);
        setProduits(p);
        setCategories(c);
      } catch {
        setError('Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtrage côté client (le backend ne fournit pas de filtre)
  const filtered = useMemo(() => {
    return produits.filter((p) => {
      const okQ = q ? (p.nom + ' ' + (p.description ?? '')).toLowerCase().includes(q.toLowerCase()) : true;
      const okCat = categorieId
        ? String(p.categorie?.idcategorie_produit ?? '') === categorieId
        : true;
      return okQ && okCat;
    });
  }, [produits, q, categorieId]);

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (search.trim()) next.set('q', search.trim());
    else next.delete('q');
    setSearchParams(next);
  };

  const onCategorie = (id: string) => {
    const next = new URLSearchParams(searchParams);
    if (id) next.set('categorie', id);
    else next.delete('categorie');
    setSearchParams(next);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Boutique</h1>
        <p className="mt-1 text-stone-500">
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* ---------- Filtres ---------- */}
        <aside className="card h-fit p-5">
          <h3 className="mb-3 text-sm font-semibold text-stone-900">Recherche</h3>
          <form onSubmit={applySearch} className="mb-6 flex gap-2">
            <input
              className="input"
              placeholder="Mot-clé"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-primary !px-4">OK</button>
          </form>

          <h3 className="mb-3 text-sm font-semibold text-stone-900">Catégories</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onCategorie('')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  !categorieId ? 'bg-brand-50 font-semibold text-brand-800' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                Toutes les catégories
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.idcategorie_produit}>
                <button
                  onClick={() => onCategorie(String(c.idcategorie_produit))}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    categorieId === String(c.idcategorie_produit)
                      ? 'bg-brand-50 font-semibold text-brand-800'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {c.nomCategorieproduit}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ---------- Grille ---------- */}
        <div>
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card aspect-[4/3] animate-pulse bg-stone-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card flex items-center justify-center py-20 text-stone-500">
              Aucun produit ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} produit={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
