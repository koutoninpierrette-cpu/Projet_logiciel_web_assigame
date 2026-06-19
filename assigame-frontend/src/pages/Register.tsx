/**
 * Page Inscription.
 * - Charge dynamiquement les types d'utilisateur depuis /api/typeutilisateur/list
 *   afin que l'acheteur/vendeur puisse choisir son rôle.
 */
import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listTypesUtilisateur } from '../api/typeUtilisateur';
import { TypeUtilisateur } from '../types';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    numeroWhatsapp: '',
    typeUtilisateurId: 0,
  });
  const [types, setTypes] = useState<TypeUtilisateur[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les types utilisateur disponibles
  useEffect(() => {
    listTypesUtilisateur()
      .then((res) => {
        // On exclut "ADMIN" de la liste publique : seuls Vendeur / Acheteur sont créables ici
        const filtered = res.filter((t) => !/admin/i.test(t.nomTypeutilisateur));
        setTypes(filtered);
        if (filtered.length > 0) {
          setForm((f) => ({ ...f, typeUtilisateurId: filtered[0].id_typeutilisateur }));
        }
      })
      .catch(() => setError("Impossible de charger les types d'utilisateur."));
  }, []);

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: key === 'typeUtilisateurId' ? Number(e.target.value) : e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.typeUtilisateurId) {
      setError('Veuillez choisir un type de compte.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Inscription impossible. L'email est peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Créer un compte</h1>
        <p className="mt-2 text-stone-500">Rejoignez Assigame en moins d&apos;une minute.</p>
      </div>

      <form onSubmit={onSubmit} className="card w-full space-y-4 p-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="prenom">Prénom</label>
            <input id="prenom" required className="input" value={form.prenom} onChange={onChange('prenom')} />
          </div>
          <div>
            <label className="label" htmlFor="nom">Nom</label>
            <input id="nom" required className="input" value={form.nom} onChange={onChange('nom')} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" value={form.email} onChange={onChange('email')} />
        </div>

        <div>
          <label className="label" htmlFor="whatsapp">Numéro WhatsApp</label>
          <input
            id="whatsapp"
            type="tel"
            required
            placeholder="Ex : 22890000000"
            className="input"
            value={form.numeroWhatsapp}
            onChange={onChange('numeroWhatsapp')}
          />
          <p className="mt-1 text-xs text-stone-500">Format international, sans le « + ».</p>
        </div>

        <div>
          <label className="label" htmlFor="mdp">Mot de passe</label>
          <input
            id="mdp"
            type="password"
            required
            minLength={6}
            className="input"
            value={form.motDePasse}
            onChange={onChange('motDePasse')}
          />
        </div>

        <div>
          <label className="label" htmlFor="type">Je m&apos;inscris en tant que</label>
          <select id="type" className="input" value={form.typeUtilisateurId} onChange={onChange('typeUtilisateurId')}>
            <option value={0} disabled>— Choisir —</option>
            {types.map((t) => (
              <option key={t.id_typeutilisateur} value={t.id_typeutilisateur}>
                {t.nomTypeutilisateur}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Création…' : 'Créer mon compte'}
        </button>

        <p className="text-center text-sm text-stone-500">
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </section>
  );
}
