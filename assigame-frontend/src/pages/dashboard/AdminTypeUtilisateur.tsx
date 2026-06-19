/**
 * Admin · Gestion des types d'utilisateur (Admin / Vendeur / Acheteur).
 */
import { FormEvent, useEffect, useState } from 'react';
import { TypeUtilisateur } from '../../types';
import {
  listTypesUtilisateur,
  createTypeUtilisateur,
  updateTypeUtilisateur,
  deleteTypeUtilisateur,
} from '../../api/typeUtilisateur';

const EMPTY = { nomTypeutilisateur: '', descriptionTypeutilisateur: '' };

export default function AdminTypeUtilisateur() {
  const [items, setItems] = useState<TypeUtilisateur[]>([]);
  const [form, setForm] = useState<{ id?: number; nomTypeutilisateur: string; descriptionTypeutilisateur: string }>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setItems(await listTypesUtilisateur());
    } catch {
      setError("Impossible de charger les types d'utilisateur.");
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
        await updateTypeUtilisateur(form.id, {
          nomTypeutilisateur: form.nomTypeutilisateur,
          descriptionTypeutilisateur: form.descriptionTypeutilisateur,
        });
      } else {
        await createTypeUtilisateur({
          nomTypeutilisateur: form.nomTypeutilisateur,
          descriptionTypeutilisateur: form.descriptionTypeutilisateur,
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

  const onEdit = (t: TypeUtilisateur) =>
    setForm({
      id: t.id_typeutilisateur,
      nomTypeutilisateur: t.nomTypeutilisateur,
      descriptionTypeutilisateur: t.descriptionTypeutilisateur ?? '',
    });

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer ce type d\'utilisateur ?')) return;
    try {
      await deleteTypeUtilisateur(id);
      setItems((arr) => arr.filter((t) => t.id_typeutilisateur !== id));
    } catch {
      alert('Suppression impossible.');
    }
  };

  return (
    <>
      <h2 className="mb-5 font-display text-2xl font-semibold text-stone-900">Types d&apos;utilisateur</h2>

      <form onSubmit={onSubmit} className="card mb-6 grid gap-3 p-5 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="label">Nom (ADMIN, VENDEUR, ACHETEUR…)</label>
          <input
            className="input"
            required
            value={form.nomTypeutilisateur}
            onChange={(e) => setForm({ ...form, nomTypeutilisateur: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Description</label>
          <input
            className="input"
            value={form.descriptionTypeutilisateur}
            onChange={(e) => setForm({ ...form, descriptionTypeutilisateur: e.target.value })}
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
            {items.map((t) => (
              <tr key={t.id_typeutilisateur} className="border-t border-stone-100">
                <td className="px-4 py-3 font-medium">{t.nomTypeutilisateur}</td>
                <td className="px-4 py-3 text-stone-600">{t.descriptionTypeutilisateur || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(t)} className="btn-secondary !py-1.5 !px-3 !text-xs">Modifier</button>
                  <button
                    onClick={() => onDelete(t.id_typeutilisateur)}
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
                  Aucun type d&apos;utilisateur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
