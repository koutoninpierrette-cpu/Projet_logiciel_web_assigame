import { Icon } from './icons'
import type { Product } from './types'

export function Stars({ value }: { value: number }) {
  return (
    <div className="stars" aria-label={`Note ${value} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="icon-star" className={i < Math.round(value) ? 'star filled' : 'star'} />
      ))}
    </div>
  )
}

export function ProductCard({
  product,
  inCart,
  isFavorite,
  onAddToCart,
  onToggleWishlist,
}: {
  product: Product
  inCart: number
  isFavorite: boolean
  onAddToCart: (id: string) => void
  onToggleWishlist: (id: string) => void
}) {
  return (
    <article className="product-card" id={`product-${product.id}`}>
      <div className={`product-thumb accent-${product.accent}`}>
        {product.badge && <span className={`badge badge-${product.badge.toLowerCase().replace('-', '')}`}>{product.badge}</span>}
        <button
          className={`wishlist-btn${isFavorite ? ' active' : ''}`}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={isFavorite}
          type="button"
          onClick={() => onToggleWishlist(product.id)}
        >
          <Icon name="icon-heart" />
        </button>
        {product.image ? (
          <img className="product-image" src={product.image} alt={product.name} />
        ) : (
          <Icon name={product.icon} className="product-icon" />
        )}
      </div>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        {product.shopName && (
          <span className="product-shop">
            <Icon name="icon-store" />
            {product.shopName}
            {product.shopPhone && ` - ${product.shopPhone}`}
          </span>
        )}
        <div className="product-rating">
          <Stars value={product.rating} />
          <span className="rating-value">{product.rating.toFixed(1)}</span>
          <span className="rating-count">({product.reviews})</span>
        </div>
        <div className="product-footer">
          <div className="price-group">
            <span className="price">{product.price.toFixed(3)} FCFA</span>
            {product.oldPrice && <span className="old-price">{product.oldPrice.toFixed(3)} FCFA</span>}
          </div>
          <button className="btn btn-primary btn-sm" type="button" onClick={() => onAddToCart(product.id)}>
            <Icon name="icon-cart" />
            {inCart > 0 ? `Ajouté (${inCart})` : 'Ajouter'}
          </button>
        </div>
      </div>
    </article>
  )
}
