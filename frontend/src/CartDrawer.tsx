import { Icon } from './icons'
import type { Product } from './types'

type CartLine = {
  product: Product
  quantity: number
}

type CartDrawerProps = {
  open: boolean
  items: CartLine[]
  total: number
  ordered: boolean
  onClose: () => void
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onRemove: (id: string) => void
  onCheckout: () => void
}

function CartDrawer({ open, items, total, ordered, onClose, onIncrement, onDecrement, onRemove, onCheckout }: CartDrawerProps) {
  return (
    <div className={`cart-overlay${open ? ' open' : ''}`} aria-hidden={!open}>
      <button className="cart-backdrop" aria-label="Fermer le panier" type="button" onClick={onClose} />
      <aside className="cart-drawer" aria-label="Panier">
        <div className="cart-header">
          <h2>Votre panier</h2>
          <button className="icon-btn" aria-label="Fermer" type="button" onClick={onClose}>
            <Icon name="icon-close" />
          </button>
        </div>

        {ordered ? (
          <div className="cart-empty cart-success">
            <span className="cart-success-icon">
              <Icon name="icon-check" />
            </span>
            <h3>Commande confirmée</h3>
            <p>Merci pour votre achat. Un e-mail de confirmation va vous être envoyé.</p>
            <button className="btn btn-primary" type="button" onClick={onClose}>
              Continuer mes achats
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">
              <Icon name="icon-cart" />
            </span>
            <h3>Votre panier est vide</h3>
            <p>Parcourez le catalogue et ajoutez vos produits préférés.</p>
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Voir le catalogue
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {items.map(({ product, quantity }) => (
                <li className="cart-item" key={product.id}>
                  <div className={`cart-item-thumb accent-${product.accent}`}>
                    <Icon name={product.icon} className="cart-item-icon" />
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{product.name}</span>
                    <span className="cart-item-price">{product.price.toFixed(2)} FCFA</span>
                    {product.shopName && (
                      <span className="cart-item-shop">
                        <Icon name="icon-store" />
                        {product.shopName}
                        {product.shopPhone && ` - ${product.shopPhone}`}
                      </span>
                    )}
                    <div className="qty-control">
                      <button type="button" aria-label="Diminuer la quantité" onClick={() => onDecrement(product.id)}>
                        <Icon name="icon-minus" />
                      </button>
                      <span>{quantity}</span>
                      <button type="button" aria-label="Augmenter la quantité" onClick={() => onIncrement(product.id)}>
                        <Icon name="icon-plus" />
                      </button>
                    </div>
                  </div>
                  <button className="cart-item-remove" aria-label="Retirer l'article" type="button" onClick={() => onRemove(product.id)}>
                    <Icon name="icon-trash" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>{total.toFixed(2)} FCFA</span>
              </div>
              <button className="btn btn-primary cart-checkout" type="button" onClick={onCheckout}>
                Valider la commande
                <Icon name="icon-arrow-right" />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer
