import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-stone-900">Page introuvable</h1>
      <p className="mt-3 text-stone-500">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary mt-8 inline-flex">Retour à l&apos;accueil</Link>
    </section>
  );
}
