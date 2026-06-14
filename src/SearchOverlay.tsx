import { useEffect, useRef } from 'react'
import { Icon } from './icons'
import type { Product } from './types'

type SearchOverlayProps = {
  open: boolean
  query: string
  results: Product[]
  onQueryChange: (value: string) => void
  onClose: () => void
  onSelect: (product: Product) => void
}

function SearchOverlay({ open, query, results, onQueryChange, onClose, onSelect }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  return (
    <div className={`search-overlay${open ? ' open' : ''}`} aria-hidden={!open}>
      <button className="cart-backdrop" aria-label="Fermer la recherche" type="button" onClick={onClose} />
      <div className="search-panel">
        <div className="search-input-row">
          <Icon name="icon-search" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un produit, une catégorie..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          <button className="icon-btn" aria-label="Fermer la recherche" type="button" onClick={onClose}>
            <Icon name="icon-close" />
          </button>
        </div>

        {query.trim() !== '' && (
          <div className="search-results">
            {results.length === 0 ? (
              <p className="search-empty">Aucun produit ne correspond à « {query} ».</p>
            ) : (
              <ul>
                {results.map((product) => (
                  <li key={product.id}>
                    <button type="button" className="search-result" onClick={() => onSelect(product)}>
                      <span className={`search-result-thumb accent-${product.accent}`}>
                        <Icon name={product.icon} />
                      </span>
                      <span className="search-result-info">
                        <span className="search-result-name">{product.name}</span>
                        <span className="search-result-category">{product.category}</span>
                      </span>
                      <span className="search-result-price">{product.price.toFixed(2)} €</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchOverlay
