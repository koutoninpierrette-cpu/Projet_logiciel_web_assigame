import { Icon } from './icons'
import type { Shop } from './types'

function ShopsPage({ shops, onSelectShop }: { shops: Shop[]; onSelectShop: (id: string) => void }) {
  return (
    <section className="shops-page">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-tag">Marketplace</span>
            <h2>Toutes les boutiques</h2>
          </div>
          <p className="section-text">
            Découvrez les boutiques partenaires et leurs sélections de produits gaming et tech.
          </p>
        </div>

        {shops.length === 0 ? (
          <p className="empty-state">Aucune boutique disponible pour le moment.</p>
        ) : (
          <div className="shop-grid">
            {shops.map((shop) => (
              <button className="shop-card" type="button" key={shop.id} onClick={() => onSelectShop(shop.id)}>
                <span className="shop-logo">
                  {shop.logo ? (
                    <img src={shop.logo} alt="" />
                  ) : (
                    <Icon name="icon-store" />
                  )}
                </span>
                <span className="shop-name">{shop.name}</span>
                <span className="shop-desc">{shop.description || 'Aucune description fournie.'}</span>
                <span className="shop-meta">
                  {shop.ownerName && <span className="shop-owner">Par {shop.ownerName}</span>}
                  <span className="shop-count">
                    {shop.productCount} produit{shop.productCount === 1 ? '' : 's'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ShopsPage
