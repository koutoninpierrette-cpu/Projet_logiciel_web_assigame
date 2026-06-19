/**
 * Admin · Gestion des catégories produit.
 */
import { FormEvent, useEffect, useState } from 'react';
import { CategorieProduit } from '../../types';
import {
  listCategories,
  createCategorie,
  updateCategorie,
  deleteCategorie,
} from '../../api/categories';

const EMPTY = { nomCategorieproduit: '', description: '' };

export default function AdminCategories() {
  const [items, setItems] = useState<CategorieProduit[]>([]);
  const [form, setForm] = useState<{ id?: number; nomCategorieproduit: string; description: string }>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await listCategories());
    } catch {
      setError('Impossible de charger les catégories.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (form.id) {
        await updateCategorie(form.id, {
          nomCategorieproduit: form.nomCategorieproduit,
          description: form.description,
        });
      } else {
        await createCategorie({
          nomCategorieproduit: form.nomCategorieproduit,
          description: form.description,
        });
      }
      setForm(EMPTY);
      await load();
    } catch {
      setError("Impossible d'enregistrer.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (c: CategorieProduit) =>
    setForm({
      id: c.idcategorie_produit,
      nomCategorieproduit: c.nomCategorieproduit,
      description: c.description ?? '',
    });

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await deleteCategorie(id);
      setItems((arr) => arr.filter((c) => c.idcategorie_produit !== id));
    } catch {
      alert('Suppression impossible.');
    }
  };

  return (
    <>
      <h2 className="mb-5 font-display text-2xl font-semibold text-stone-900">Catégories</h2>

      {/* ----- Formulaire create / edit ----- */}
      <form onSubmit={onSubmit} className="card mb-6 grid gap-3 p-5 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="label">Nom</label>
          <input
            className="input"
            required
            value={form.nomCategorieproduit}
            onChange={(e) => setForm({ ...form, nomCategorieproduit: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Description</label>
          <input
            className="input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex items-end gap-2">
          <button disabled={saving} className="btn-primary">
            {form.id ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {form.id && (
            <button type="button" className="btn-secondary" onClick={() => setForm(EMPTY)}>
              Annuler
            </button>
          )}
        </div>
        {error && (
          <div className="md:col-span-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </form>

      {/* ----- Liste ----- */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.idcategorie_produit} className="border-t border-stone-100">
                <td className="px-4 py-3 font-medium">{c.nomCategorieproduit}</td>
                <td className="px-4 py-3 text-stone-600">{c.description || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(c)} className="btn-secondary !py-1.5 !px-3 !text-xs">Modifier</button>
                  <button
                    onClick={() => onDelete(c.idcategorie_produit)}
                    className="btn-danger ml-2 !py-1.5 !px-3 !text-xs"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-stone-500">
                  Aucune catégorie pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
