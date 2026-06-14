import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Icon } from './icons'
import { ProductCard } from './ProductCard'
import {
  createBoutique,
  createProduit,
  updateUtilisateur,
  uploadFile,
  ApiError,
  type ApiBoutique,
  type ApiCategorie,
  type ApiProduit,
  type ApiUtilisateur,
} from './api'
import type { Product, Shop } from './types'

function MyShopPage({
  currentUser,
  shop,
  products,
  categories,
  cart,
  wishlist,
  onShopCreated,
  onProductCreated,
  onUserUpdated,
  onAddToCart,
  onToggleWishlist,
}: {
  currentUser: ApiUtilisateur
  shop: Shop | null
  products: Product[]
  categories: ApiCategorie[]
  cart: Record<string, number>
  wishlist: Record<string, boolean>
  onShopCreated: (boutique: ApiBoutique) => void
  onProductCreated: (produit: ApiProduit) => void
  onUserUpdated: (user: ApiUtilisateur) => void
  onAddToCart: (id: string) => void
  onToggleWishlist: (id: string) => void
}) {
  const [shopName, setShopName] = useState('')
  const [shopDescription, setShopDescription] = useState('')
  const [shopLogo, setShopLogo] = useState<File | null>(null)
  const [shopPhone, setShopPhone] = useState(currentUser.telephone ?? '')
  const [shopError, setShopError] = useState<string | null>(null)
  const [shopLoading, setShopLoading] = useState(false)

  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productImage, setProductImage] = useState<File | null>(null)
  const [productCategory, setProductCategory] = useState('')
  const [productStatus, setProductStatus] = useState('disponible')
  const [productError, setProductError] = useState<string | null>(null)
  const [productSuccess, setProductSuccess] = useState<string | null>(null)
  const [productLoading, setProductLoading] = useState(false)
  const [productImageInputKey, setProductImageInputKey] = useState(0)

  async function handleCreateShop(event: FormEvent) {
    event.preventDefault()
    setShopError(null)

    if (!shopName.trim()) {
      setShopError('Le nom de la boutique est requis.')
      return
    }
    if (!shopPhone.trim()) {
      setShopError('Le numéro de téléphone est requis.')
      return
    }

    setShopLoading(true)
    try {
      let logoUrl: string | undefined
      if (shopLogo) {
        logoUrl = await uploadFile(shopLogo)
      }

      const boutique = await createBoutique({
        nom_boutique: shopName.trim(),
        description: shopDescription.trim() || undefined,
        logo: logoUrl,
        utilisateur: { id_utilisateur: currentUser.id_utilisateur },
      })

      if (shopPhone.trim() !== (currentUser.telephone ?? '')) {
        const updatedUser = await updateUtilisateur(currentUser.id_utilisateur, { telephone: shopPhone.trim() })
        onUserUpdated(updatedUser)
      }

      onShopCreated(boutique)
    } catch (error) {
      setShopError(error instanceof ApiError ? error.message : 'Impossible de créer la boutique.')
    } finally {
      setShopLoading(false)
    }
  }

  async function handleCreateProduct(event: FormEvent) {
    event.preventDefault()
    setProductError(null)
    setProductSuccess(null)

    if (!shop) return

    const price = Number(productPrice)
    if (!productName.trim()) {
      setProductError('Le nom du produit est requis.')
      return
    }
    if (!productPrice || Number.isNaN(price) || price < 0) {
      setProductError('Le prix doit être un nombre valide.')
      return
    }
    if (!productCategory) {
      setProductError('Choisissez une catégorie.')
      return
    }

    setProductLoading(true)
    try {
      let imageUrl: string | undefined
      if (productImage) {
        imageUrl = await uploadFile(productImage)
      }

      const produit = await createProduit({
        nom_produit: productName.trim(),
        description: productDescription.trim() || undefined,
        prix: price,
        image: imageUrl,
        date_ajout: new Date().toISOString(),
        statut: productStatus,
        categorieProduit: { idcategorie_produit: Number(productCategory) },
        utilisateur: { id_utilisateur: currentUser.id_utilisateur },
        boutique: { id_boutique: shop.rawId },
      })
      onProductCreated(produit)
      setProductSuccess('Produit ajouté avec succès.')
      setProductName('')
      setProductDescription('')
      setProductPrice('')
      setProductImage(null)
      setProductCategory('')
      setProductImageInputKey((key) => key + 1)
    } catch (error) {
      setProductError(error instanceof ApiError ? error.message : "Impossible d'ajouter le produit.")
    } finally {
      setProductLoading(false)
    }
  }

  if (!shop) {
    return (
      <section className="my-shop-page">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-tag">Vendeur</span>
              <h2>Créer ma boutique</h2>
            </div>
          </div>
          <form className="shop-form" onSubmit={handleCreateShop}>
            <div className="input-group">
              <label htmlFor="shop-name">Nom de la boutique</label>
              <input
                id="shop-name"
                type="text"
                value={shopName}
                onChange={(event) => setShopName(event.target.value)}
                placeholder="Ex : GameZone Store"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="shop-description">Description</label>
              <textarea
                id="shop-description"
                value={shopDescription}
                onChange={(event) => setShopDescription(event.target.value)}
                placeholder="Présentez votre boutique en quelques mots"
                rows={4}
              />
            </div>
            <div className="input-group">
              <label htmlFor="shop-phone">Numéro de téléphone</label>
              <input
                id="shop-phone"
                type="tel"
                value={shopPhone}
                onChange={(event) => setShopPhone(event.target.value)}
                placeholder="Ex : 06 12 34 56 78"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="shop-logo">Logo (optionnel)</label>
              <input
                id="shop-logo"
                type="file"
                accept="image/*"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setShopLogo(event.target.files?.[0] ?? null)}
              />
            </div>
            {shopError && <p className="form-error">{shopError}</p>}
            <button className="btn btn-primary" type="submit" disabled={shopLoading}>
              {shopLoading ? 'Création...' : 'Créer ma boutique'}
            </button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="my-shop-page">
      <div className="container">
        <div className="shop-header">
          <span className="shop-logo shop-logo-lg">
            {shop.logo ? <img src={shop.logo} alt="" /> : <Icon name="icon-store" />}
          </span>
          <div className="shop-header-info">
            <h2>{shop.name}</h2>
            <p className="shop-description">{shop.description || 'Aucune description fournie.'}</p>
            <span className="shop-count">
              {products.length} produit{products.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="section-head">
          <div>
            <span className="section-tag">Gestion</span>
            <h2>Ajouter un produit</h2>
          </div>
        </div>

        <form className="shop-form" onSubmit={handleCreateProduct}>
          <div className="input-group">
            <label htmlFor="product-name">Nom du produit</label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder="Ex : Manette Pro X"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              value={productDescription}
              onChange={(event) => setProductDescription(event.target.value)}
              placeholder="Décrivez le produit"
              rows={3}
            />
          </div>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="product-price">Prix (€)</label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={productPrice}
                onChange={(event) => setProductPrice(event.target.value)}
                placeholder="49.99"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="product-category">Catégorie</label>
              <select
                id="product-category"
                value={productCategory}
                onChange={(event) => setProductCategory(event.target.value)}
                required
              >
                <option value="">Choisir...</option>
                {categories.map((category) => (
                  <option key={category.idcategorie_produit} value={category.idcategorie_produit}>
                    {category.nom_categorieproduit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="product-image">Image (optionnel)</label>
              <input
                key={productImageInputKey}
                id="product-image"
                type="file"
                accept="image/*"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setProductImage(event.target.files?.[0] ?? null)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="product-status">Statut</label>
              <select
                id="product-status"
                value={productStatus}
                onChange={(event) => setProductStatus(event.target.value)}
              >
                <option value="disponible">Disponible</option>
                <option value="indisponible">Indisponible</option>
              </select>
            </div>
          </div>
          {productError && <p className="form-error">{productError}</p>}
          {productSuccess && <p className="form-success">{productSuccess}</p>}
          <button className="btn btn-primary" type="submit" disabled={productLoading}>
            {productLoading ? 'Ajout...' : 'Ajouter le produit'}
          </button>
        </form>

        <div className="section-head">
          <div>
            <span className="section-tag">Catalogue</span>
            <h2>Mes produits</h2>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="empty-state">Vous n&apos;avez pas encore ajouté de produit.</p>
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

export default MyShopPage
