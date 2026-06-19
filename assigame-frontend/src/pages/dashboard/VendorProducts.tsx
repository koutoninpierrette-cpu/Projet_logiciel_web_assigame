/**
 * Page Vendeur : gérer ses annonces (créer / modifier / supprimer).
 * Note : l'entité Produit du backend ne contient pas de champ `vendeur`,
 * donc tous les produits sont visibles ici. Pour isoler par vendeur,
 * il faudra ajouter un champ `vendeur_id` côté backend.
 */
import { FormEvent, useEffect, useState } from 'react';
import { Produit, CategorieProduit } from '../../types';
import { listProduits, createProduit, updateProduit, deleteProduit } from '../../api/produits';
import { listCategories } from '../../api/categories';
import { uploadImage } from '../../api/upload';
import { resolveImageUrl } from '../../api/axios';
import { formatPrice } from '../../lib/utils';

interface Form {
  id?: number;
  nom: string;
  description: string;
  prix: string;
  imageUrl: string;
  categorieId: string;
}

const EMPTY: Form = { nom: '', description: '', prix: '', imageUrl: '', categorieId: '' };

export default function VendorProducts() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<CategorieProduit[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [p, c] = await Promise.all([listProduits(), listCategories()]);
      setProduits(p);
      setCategories(c);
    } catch {
      setError('Impossible de charger les données.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setOpen(true);
    setError(null);
  };

  const openEdit = (p: Produit) => {
    setForm({
      id: p.id,
      nom: p.nom,
      description: p.description ?? '',
      prix: String(p.prix ?? ''),
      imageUrl: p.imageUrl ?? '',
      categorieId: p.categorie?.idcategorie_produit ? String(p.categorie.idcategorie_produit) : '',
    });
    setOpen(true);
    setError(null);
  };

  const onFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const path = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: path }));
    } catch {
      setError("L'upload de l'image a échoué.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Partial<Produit> = {
        nom: form.nom,
        description: form.description,
        prix: parseFloat(form.prix),
        imageUrl: form.imageUrl || undefined,
        categorie: form.categorieId
          ? ({ idcategorie_produit: Number(form.categorieId) } as CategorieProduit)
          : undefined,
      };
      if (form.id) {
        await updateProduit(form.id, payload);
      } else {
        await createProduit(payload);
      }
      setOpen(false);
      await load();
    } catch {
      setError("Impossible d'enregistrer le produit.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Confirmer la suppression de cette annonce ?')) return;
    try {
      await deleteProduit(id);
      await load();
    } catch {
      alert('Suppression impossible.');
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-stone-900">Annonces ({produits.length})</h2>
        <button onClick={openCreate} className="btn-primary">+ Nouvelle annonce</button>
      </div>

      {error && !open && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {produits.length === 0 ? (
        <div className="card py-16 text-center text-stone-500">
          Vous n&apos;avez pas encore publié d&apos;annonce. Cliquez sur « Nouvelle annonce » pour démarrer.
        </div>
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
                    <button onClick={() => openEdit(p)} className="btn-secondary !py-1.5 !px-3 !text-xs">
                      Modifier
                    </button>
                    <button onClick={() => onDelete(p.id)} className="btn-danger ml-2 !py-1.5 !px-3 !text-xs">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Modale formulaire ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4">
          <form onSubmit={onSubmit} className="card w-full max-w-2xl space-y-4 p-6">
            <header className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">
                {form.id ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
              </h3>
              <button type="button" onClick={() => setOpen(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </header>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label className="label">Nom du produit</label>
              <input
                className="input"
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Prix (FCFA)</label>
                <input
                  className="input"
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Catégorie</label>
                <select
                  className="input"
                  value={form.categorieId}
                  onChange={(e) => setForm({ ...form, categorieId: e.target.value })}
                >
                  <option value="">— Aucune —</option>
                  {categories.map((c) => (
                    <option key={c.idcategorie_produit} value={c.idcategorie_produit}>
                      {c.nomCategorieproduit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                className="input min-h-[100px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Image</label>
              <div className="flex items-center gap-4">
                {form.imageUrl ? (
                  <img src={resolveImageUrl(form.imageUrl)} alt="aperçu" className="h-20 w-20 rounded-lg object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-stone-100" />
                )}
                <label className="btn-secondary cursor-pointer">
                  {uploading ? 'Envoi…' : 'Choisir une image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <footer className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
                Annuler
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Enregistrement…' : form.id ? 'Mettre à jour' : 'Publier'}
              </button>
            </footer>
          </form>
        </div>
      )}
    </>
  );
}
