/**
 * Admin · Gestion des produits : supprimer toute annonce (modération).
 * Réutilise les mêmes endpoints CRUD.
 */
import { useEffect, useState } from 'react';
import { Produit } from '../../types';
import { listProduits, deleteProduit } from '../../api/produits';
import { resolveImageUrl } from '../../api/axios';
import { formatPrice } from '../../lib/utils';

export default function AdminProducts() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setProduits(await listProduits());
    } catch {
      setError('Impossible de charger les produits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer définitivement cette annonce ?')) return;
    try {
      await deleteProduit(id);
      setProduits((p) => p.filter((x) => x.id !== id));
    } catch {
      alert('Suppression impossible.');
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-stone-900">
          Tous les produits ({produits.length})
        </h2>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="card animate-pulse py-20" />
      ) : produits.length === 0 ? (
        <div className="card py-16 text-center text-stone-500">Aucun produit n&apos;a été publié.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p) => (
                <tr key={p.id} className="border-t border-stone-100">
                  <td className="px-4 py-3">
                    {p.imageUrl ? (
                      <img src={resolveImageUrl(p.imageUrl)} alt={p.nom} className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-stone-100" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-900">{p.nom}</td>
                  <td className="px-4 py-3 text-stone-600">{p.categorie?.nomCategorieproduit ?? '—'}</td>
                  <td className="px-4 py-3 font-semibold text-brand-700">{formatPrice(p.prix)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onDelete(p.id)} className="btn-danger !py-1.5 !px-3 !text-xs">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
