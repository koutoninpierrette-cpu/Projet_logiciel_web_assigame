import { Icon } from './icons'
import { ProductCard } from './ProductCard'
import type { Product, Shop } from './types'

function ShopPage({
  shop,
  products,
  cart,
  wishlist,
  onBack,
  onAddToCart,
  onToggleWishlist,
}: {
  shop: Shop
  products: Product[]
  cart: Record<string, number>
  wishlist: Record<string, boolean>
  onBack: () => void
  onAddToCart: (id: string) => void
  onToggleWishlist: (id: string) => void
}) {
  return (
    <section className="shop-page">
      <div className="container">
        <button className="link-back" type="button" onClick={onBack}>
          <Icon name="icon-arrow-right" className="icon-flip" />
          Toutes les boutiques
        </button>

        <div className="shop-header">
          <span className="shop-logo shop-logo-lg">
            {shop.logo ? <img src={shop.logo} alt="" /> : <Icon name="icon-store" />}
          </span>
          <div className="shop-header-info">
            <h2>{shop.name}</h2>
            {shop.ownerName && <p className="shop-owner">Boutique tenue par {shop.ownerName}</p>}
            <p className="shop-description">{shop.description || 'Aucune description fournie.'}</p>
            <span className="shop-count">
              {shop.productCount} produit{shop.productCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="section-head">
          <div>
            <span className="section-tag">Catalogue</span>
            <h2>Produits de la boutique</h2>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="empty-state">Cette boutique n&apos;a pas encore de produits en ligne.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                inCart={cart[product.id] ?? 0}
                isFavorite={Boolean(wishlist[product.id])}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ShopPage
