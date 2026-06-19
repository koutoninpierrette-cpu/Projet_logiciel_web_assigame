/**
 * Utilitaires divers.
 */

/** Formatte un prix en FCFA (XOF). Ajuste ici si tu veux une autre devise. */
export function formatPrice(value?: number | null): string {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Tronque un texte à n caractères. */
export function truncate(text?: string | null, n: number = 80): string {
  if (!text) return '';
  return text.length > n ? text.slice(0, n).trim() + '…' : text;
}

/** Récupère un lien WhatsApp (numéro au format international, sans +). */
export function whatsappLink(numero?: string | null, message?: string): string {
  if (!numero) return '#';
  const clean = numero.replace(/[^0-9]/g, '');
  const msg = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${clean}${msg}`;
}
