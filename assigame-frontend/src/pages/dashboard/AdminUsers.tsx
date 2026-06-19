/**
 * Admin · Gestion des utilisateurs (lecture + suppression + changement de statut).
 */
import { useEffect, useState } from 'react';
import { Utilisateur } from '../../types';
import { listUtilisateurs, deleteUtilisateur, updateUtilisateur } from '../../api/utilisateurs';

export default function AdminUsers() {
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await listUtilisateurs());
    } catch {
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await deleteUtilisateur(id);
      setUsers((u) => u.filter((x) => x.id !== id));
    } catch {
      alert('Suppression impossible.');
    }
  };

  // Bascule du statut entre ACTIF / SUSPENDU
  const onToggleStatus = async (u: Utilisateur) => {
    const newStatut = u.statut === 'ACTIF' ? 'SUSPENDU' : 'ACTIF';
    try {
      // On envoie l'utilisateur entier (sans le motDePasse) avec le nouveau statut
      const payload: Partial<Utilisateur> = { ...u, statut: newStatut, motDePasse: undefined };
      const saved = await updateUtilisateur(u.id, payload);
      setUsers((arr) => arr.map((x) => (x.id === u.id ? saved : x)));
    } catch {
      alert('Mise à jour impossible.');
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-stone-900">Utilisateurs ({users.length})</h2>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="card animate-pulse py-20" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3">Nom complet</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-stone-100">
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {u.prenom} {u.nom}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{u.email}</td>
                  <td className="px-4 py-3 text-stone-600">{u.numeroWhatsapp || '—'}</td>
                  <td className="px-4 py-3 text-stone-600">{u.typeUtilisateur?.nomTypeutilisateur ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        u.statut === 'ACTIF'
                          ? 'bg-brand-100 text-brand-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onToggleStatus(u)} className="btn-secondary !py-1.5 !px-3 !text-xs">
                      {u.statut === 'ACTIF' ? 'Suspendre' : 'Réactiver'}
                    </button>
                    <button onClick={() => onDelete(u.id)} className="btn-danger ml-2 !py-1.5 !px-3 !text-xs">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-stone-500">
                    Aucun utilisateur enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
