import { useEffect, useMemo, useState, type FormEvent } from 'react'
import AuthPage from './AuthPage'
import CartDrawer from './CartDrawer'
import SearchOverlay from './SearchOverlay'
import ShopsPage from './ShopsPage'
import ShopPage from './ShopPage'
import MyShopPage from './MyShopPage'
import AdminPage from './AdminPage'
import { Icon } from './icons'
import { ProductCard } from './ProductCard'
import type { Category, Product, Shop } from './types'
import {
  ApiError,
  fetchBoutiqueByUser,
  fetchBoutiques,
  fetchCategories,
  fetchProduits,
  fetchUtilisateur,
  setAuthToken,
  type ApiBoutique,
  type ApiCategorie,
  type ApiProduit,
  type ApiUtilisateur,
} from './api'
import './App.css'

function iconForCategoryName(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('gam')) return 'icon-gamepad'
  if (n.includes('audio') || n.includes('casque') || n.includes('son')) return 'icon-headphones'
  if (n.includes('composant') || n.includes('carte') || n.includes('processeur') || n.includes('gpu')) return 'icon-chip'
  if (n.includes('cran') || n.includes('moniteur')) return 'icon-monitor'
  if (n.includes('montre') || n.includes('wearable') || n.includes('connect')) return 'icon-watch'
  if (n.includes('info') || n.includes('ordinateur') || n.includes('pc')) return 'icon-laptop'
  return 'icon-gamepad'
}

const ACCENTS: Product['accent'][] = ['cyan', 'blue', 'amber', 'green']

function mapApiProduct(produit: ApiProduit, index: number): Product {
  const categoryName = produit.categorieProduit?.nom_categorieproduit ?? 'Divers'
  const isNew = Date.now() - new Date(produit.date_ajout).getTime() < 1000 * 60 * 60 * 24 * 30
  return {
    id: `prod-${produit.id_produit}`,
    name: produit.nom_produit,
    category: categoryName,
    price: produit.prix,
    rating: 4 + ((produit.id_produit * 7) % 10) / 10,
    reviews: 20 + ((produit.id_produit * 37) % 280),
    badge: isNew ? 'Nouveau' : undefined,
    accent: ACCENTS[index % ACCENTS.length],
    icon: iconForCategoryName(categoryName),
    image: produit.image,
    shopId: produit.boutique ? `shop-${produit.boutique.id_boutique}` : undefined,
    shopName: produit.boutique?.nom_boutique,
    shopPhone: produit.boutique?.utilisateur?.telephone,
  }
}

function mapApiCategory(categorie: ApiCategorie, productCount: number): Category {
  return {
    id: `cat-${categorie.idcategorie_produit}`,
    name: categorie.nom_categorieproduit,
    description: categorie.description ?? '',
    icon: iconForCategoryName(categorie.nom_categorieproduit),
    count: `${productCount} produit${productCount === 1 ? '' : 's'}`,
  }
}

function mapApiBoutique(boutique: ApiBoutique, productCount: number): Shop {
  const owner = boutique.utilisateur
  return {
    id: `shop-${boutique.id_boutique}`,
    rawId: boutique.id_boutique,
    name: boutique.nom_boutique,
    description: boutique.description ?? '',
    logo: boutique.logo,
    ownerName: owner ? `${owner.Prenom} ${owner.Nom}`.trim() : '',
    productCount,
    createdAt: boutique.date_creation,
  }
}

const fallbackCategories: Category[] = [
  { id: 'gaming', name: 'Gaming', description: 'Consoles, jeux et accessoires', icon: 'icon-gamepad', count: '420 produits' },
  { id: 'informatique', name: 'Informatique', description: 'PC portables et claviers', icon: 'icon-laptop', count: '310 produits' },
  { id: 'audio', name: 'Audio', description: 'Casques et enceintes', icon: 'icon-headphones', count: '185 produits' },
  { id: 'composants', name: 'Composants', description: 'CPU, GPU et stockage', icon: 'icon-chip', count: '260 produits' },
  { id: 'ecrans', name: 'Écrans', description: 'Moniteurs haute fréquence', icon: 'icon-monitor', count: '95 produits' },
  { id: 'wearables', name: 'Montres connectées', description: 'Suivi sport et santé', icon: 'icon-watch', count: '70 produits' },
]

const fallbackProducts: Product[] = []

const trustPoints = [
  { icon: 'icon-store', title: 'Boutiques vérifiées', text: 'Achetez auprès de vendeurs vérifiés.' },
  { icon: 'icon-monitor', title: 'Large choix de produits', text: 'Des centaines de produits proposés par différentes boutiques.' },
  { icon: 'icon-star', title: 'Avis et évaluations', text: 'Consultez les notes et commentaires des acheteurs.' },
  { icon: 'icon-shield', title: 'Transactions sécurisées', text: 'Protection des données et des échanges.' },
]

const fallbackShops: Shop[] = [
  {
    id: 'shop-1',
    rawId: 1,
    name: 'GameZone Store',
    description: 'Spécialiste des périphériques gaming : claviers, souris et casques haute performance.',
    logo: null,
    ownerName: 'Alice Dupont',
    productCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shop-2',
    rawId: 2,
    name: 'TechVision',
    description: 'Écrans, ordinateurs portables et composants pour les setups les plus exigeants.',
    logo: null,
    ownerName: 'Marc Tester',
    productCount: 0,
    createdAt: new Date().toISOString(),
  },
]

// ✅ Fonction toggle propre, hors du JSX
function toggleTheme() {
  const root = document.documentElement
  const isDark = root.dataset.theme === 'dark'
  root.dataset.theme = isDark ? 'light' : 'dark'
  localStorage.setItem('theme', root.dataset.theme)
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({})
  const [ordered, setOrdered] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [apiCategories, setApiCategories] = useState<ApiCategorie[]>([])
  const [shops, setShops] = useState<Shop[]>(fallbackShops)
  const [currentUser, setCurrentUser] = useState<ApiUtilisateur | null>(() => {
    try {
      const stored = localStorage.getItem('currentUser')
      return stored ? (JSON.parse(stored) as ApiUtilisateur) : null
    } catch {
      return null
    }
  })
  const [myShop, setMyShop] = useState<Shop | null>(null)
  const [view, setView] = useState<'home' | 'shops' | 'shop' | 'my-shop' | 'admin'>('home')
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null)

  // État pour le thème (pour mettre à jour l'icône du bouton)
  const [isDark, setIsDark] = useState(
    () => (localStorage.getItem('theme') || 'dark') === 'dark'
  )

  //  Toggle thème avec mise à jour de l'état React
  function handleToggleTheme() {
    const root = document.documentElement
    const currentlyDark = root.dataset.theme === 'dark'
    root.dataset.theme = currentlyDark ? 'light' : 'dark'
    localStorage.setItem('theme', root.dataset.theme)
    setIsDark(!currentlyDark)
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [apiCategories, apiProduits, apiBoutiques] = await Promise.all([
          fetchCategories(),
          fetchProduits(),
          fetchBoutiques(),
        ])
        if (cancelled) return

        if (apiProduits.length > 0) {
          setProducts(apiProduits.map(mapApiProduct))
        }

        if (apiCategories.length > 0) {
          const counts = new Map<number, number>()
          for (const produit of apiProduits) {
            const id = produit.categorieProduit?.idcategorie_produit
            if (id != null) counts.set(id, (counts.get(id) ?? 0) + 1)
          }
          setCategories(apiCategories.map((cat) => mapApiCategory(cat, counts.get(cat.idcategorie_produit) ?? 0)))
          setApiCategories(apiCategories)
        }

        if (apiBoutiques.length > 0) {
          const shopCounts = new Map<number, number>()
          for (const produit of apiProduits) {
            const id = produit.boutique?.id_boutique
            if (id != null) shopCounts.set(id, (shopCounts.get(id) ?? 0) + 1)
          }
          setShops(apiBoutiques.map((shop) => mapApiBoutique(shop, shopCounts.get(shop.id_boutique) ?? 0)))
        }
      } catch {
        // Le backend n'est pas joignable : on garde le catalogue de démonstration.
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!currentUser) return

    let cancelled = false
    fetchBoutiqueByUser(currentUser.id_utilisateur)
      .then((boutique) => {
        if (cancelled) return
        setMyShop(boutique ? mapApiBoutique(boutique, 0) : null)
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return

    let cancelled = false
    fetchUtilisateur(currentUser.id_utilisateur).catch((error) => {
      if (cancelled) return
      if (error instanceof ApiError) {
        handleLogout()
      }
    })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id_utilisateur])

  function handleAuthenticated(user: ApiUtilisateur) {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
    setAuthOpen(false)
  }

  function handleLogout() {
  setCurrentUser(null)
  localStorage.removeItem('currentUser')
  localStorage.removeItem('authToken')  // ✅ ajoute
  setAuthToken(null)                     // ✅ ajoute
  setAccountMenuOpen(false)
  setMyShop(null)
  setView('home')
}

  const shopsWithCounts = useMemo(
    () => shops.map((shop) => ({
      ...shop,
      productCount: products.filter((product) => product.shopId === shop.id).length,
    })),
    [shops, products],
  )

  const myShopWithCount = useMemo(() => {
    if (!myShop) return null
    return {
      ...myShop,
      productCount: products.filter((product) => product.shopId === myShop.id).length,
    }
  }, [myShop, products])

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => ({ product: products.find((p) => p.id === id)!, quantity }))
        .filter((line) => line.product && line.quantity > 0),
    [cart, products],
  )

  const cartCount = cartItems.reduce((sum, line) => sum + line.quantity, 0)
  const cartTotal = cartItems.reduce((sum, line) => sum + line.product.price * line.quantity, 0)

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return products.filter(
      (product) => product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q),
    )
  }, [searchQuery, products])

  function closeMenu() { setMenuOpen(false) }

  function addToCart(id: string) {
    setOrdered(false)
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
    setCartOpen(true)
  }

  function incrementItem(id: string) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
  }

  function decrementItem(id: string) {
    setCart((current) => {
      const next = (current[id] ?? 0) - 1
      const updated = { ...current }
      if (next <= 0) { delete updated[id] } else { updated[id] = next }
      return updated
    })
  }

  function removeItem(id: string) {
    setCart((current) => {
      const updated = { ...current }
      delete updated[id]
      return updated
    })
  }

  function toggleWishlist(id: string) {
    setWishlist((current) => ({ ...current, [id]: !current[id] }))
  }

  function handleCheckout() {
    setOrdered(true)
    setCart({})
  }

  function closeCart() {
    setCartOpen(false)
    setOrdered(false)
  }

  function handleSearchSelect(product: Product) {
    setSearchOpen(false)
    setSearchQuery('')
    const el = document.getElementById(`product-${product.id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!newsletterEmail.trim()) return
    setNewsletterSent(true)
  }

  function goHome() { setView('home'); setSelectedShopId(null); closeMenu() }
  function goToShops() { setView('shops'); setSelectedShopId(null); closeMenu() }
  function selectShop(id: string) { setSelectedShopId(id); setView('shop') }
  function goToMyShop() { setView('my-shop'); setSelectedShopId(null); setAccountMenuOpen(false); closeMenu() }
  function goToAdmin() { setView('admin'); setSelectedShopId(null); setAccountMenuOpen(false); closeMenu() }

  function handleShopCreated(boutique: ApiBoutique) {
    const shop = mapApiBoutique(boutique, 0)
    setMyShop(shop)
    setShops((current) => [...current, shop])
  }

  function handleProductCreated(produit: ApiProduit) {
    setProducts((current) => [...current, mapApiProduct(produit, products.length)])
  }

  function handleUserUpdated(user: ApiUtilisateur) {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  if (authOpen) {
    return <AuthPage onClose={() => setAuthOpen(false)} onAuthenticated={handleAuthenticated} />
  }

  const isAdmin = currentUser?.statut === 'admin'
  const selectedShop = shopsWithCounts.find((shop) => shop.id === selectedShopId) ?? null
  const shopProducts = selectedShop ? products.filter((product) => product.shopId === selectedShop.id) : []

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" className="brand" onClick={goHome}>
            <img
           src="../img.jpg" alt="ASSIGAME" className="brand-logo"/>
         <span className="brand-name">ASSIGAME</span>
          </a>

          <nav className={`main-nav${menuOpen ? ' open' : ''}`} aria-label="Navigation principale">
            <a href="#categories" onClick={goHome}>Catalogue</a>
            <a href="#produits" onClick={goHome}>Produits</a>
            <a href="#boutiques" onClick={(event) => { event.preventDefault(); goToShops() }}>Boutiques</a>
            <a href="#avantages" onClick={goHome}>Avantages</a>
          </nav>

          <div className="header-actions">
            <button className="icon-btn search-btn" aria-label="Rechercher" type="button" onClick={() => setSearchOpen(true)}>
              <Icon name="icon-search" />
            </button>

            {/*  Bouton toggle dark/light mode */}
            <button
              className="toggle-btn"
              onClick={handleToggleTheme}
              aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              title={isDark ? 'Mode clair' : 'Mode sombre'}
              type="button"
            >
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
              <span className="toggle-label">
                {isDark ? '☀️' : '🌙'}
              </span>
            </button>

            {currentUser && (
              <button className="btn btn-ghost btn-sm my-shop-btn" type="button" onClick={goToMyShop}>
                <Icon name="icon-store" />
                Ma boutique
              </button>
            )}
            <div className="account-wrap">
              {currentUser ? (
                <>
                  <button
                    className="icon-btn account-btn"
                    aria-label="Mon compte"
                    aria-expanded={accountMenuOpen}
                    type="button"
                    onClick={() => setAccountMenuOpen((open) => !open)}
                  >
                    <span className="account-initial">{currentUser.Prenom.charAt(0).toUpperCase()}</span>
                  </button>
                  {accountMenuOpen && (
                    <div className="account-menu">
                      <p className="account-greeting">Bonjour {currentUser.Prenom}</p>
                      <button type="button" className="account-link" onClick={goToMyShop}>Ma boutique</button>
                      {isAdmin && (
                        <button type="button" className="account-link" onClick={goToAdmin}>Administration</button>
                      )}
                      <button type="button" className="account-logout" onClick={handleLogout}>Se déconnecter</button>
                    </div>
                  )}
                </>
              ) : (
                <button className="icon-btn" aria-label="Mon compte" type="button" onClick={() => setAuthOpen(true)}>
                  <Icon name="icon-user" />
                </button>
              )}
            </div>
            <button className="icon-btn cart-btn" aria-label="Panier" type="button" onClick={() => setCartOpen(true)}>
              <Icon name="icon-cart" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button
              className="icon-btn menu-btn"
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'icon-close' : 'icon-menu'} />
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {view === 'shops' && <ShopsPage shops={shopsWithCounts} onSelectShop={selectShop} />}

        {view === 'shop' && selectedShop && (
          <ShopPage
            shop={selectedShop}
            products={shopProducts}
            cart={cart}
            wishlist={wishlist}
            onBack={goToShops}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
          />
        )}

        {view === 'admin' && isAdmin && <AdminPage onBack={goHome} />}

        {view === 'my-shop' && currentUser && (
          <MyShopPage
            currentUser={currentUser}
            shop={myShopWithCount}
            products={myShop ? products.filter((product) => product.shopId === myShop.id) : []}
            categories={apiCategories}
            cart={cart}
            wishlist={wishlist}
            onShopCreated={handleShopCreated}
            onProductCreated={handleProductCreated}
            onUserUpdated={handleUserUpdated}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
          />
        )}

        {view === 'home' && (
          <>
            <section className="hero">
              <div className="container hero-inner">
                <div className="hero-content">
                  <span className="eyebrow">Nouvelle collection 2026</span>
                  <h1>Achetez et vendez vos produits en toute simplicité</h1>
                  <p className="hero-text">
                    Une plateforme qui permet aux vendeurs de créer leur boutique et aux acheteurs de trouver les meilleurs produits.
                  </p>
                  <div className="hero-actions">
                    <a className="btn btn-primary" href="#produits">
                      Découvrir les produits
                      <Icon name="icon-arrow-right" />
                    </a>
                    <a className="btn btn-ghost" href="#categories">
                      Parcourir les catégories
                    </a>
                  </div>
                  <dl className="hero-stats">
                    <div><dt>Multi-catégories</dt><dd>des produits variés</dd></div>
                    <div><dt>Boutiques</dt><dd>vendeurs vérifiés</dd></div>
                    <div><dt>Sécurisé</dt><dd>achats en confiance</dd></div>
                  </dl>
                </div>

                <div className="hero-visual" aria-hidden="true">
                  <div className="hero-panel">
                    <div className="hero-panel-glow" />
                   <img src="../images.jpg" alt="Outils vidéos de surveillances" className="hero-panel-icon"/>
                    <div className="hero-card hero-card-price">
                      <span className="hero-card-label">Outils vidéos de surveillances</span>
                      <span className="hero-card-value">500.000 FCFA</span>
                    </div>
                    <div className="hero-card hero-card-rating">
                      <Icon name="icon-star" className="star filled" />
                      <span>4.9 / 5</span>
                    </div>
                    <div className="hero-card hero-card-stock">
                      <Icon name="icon-shield" />
                      <span>Garantie 2 ans</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="categories" id="categories">
              <div className="container">
                <div className="section-head">
                  <div>
                    <span className="section-tag">Catalogue</span>
                    <h2>Parcourir par catégorie</h2>
                  </div>
                  <p className="section-text"></p>
                </div>
                <div className="category-grid">
                  {categories.map((category) => (
                    <a className="category-card" href="#produits" key={category.id}>
                      <span className="category-icon"><Icon name={category.icon} /></span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-desc">{category.description}</span>
                      <span className="category-count">{category.count}</span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section className="products" id="produits">
              <div className="container">
                <div className="section-head">
                  <div>
                    <span className="section-tag">Sélection</span>
                    <h2>Produits </h2>
                  </div>
                  <a className="link-more" href="#categories">
                    Voir tout le catalogue
                    <Icon name="icon-arrow-right" />
                  </a>
                </div>
                <div className="product-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      inCart={cart[product.id] ?? 0}
                      isFavorite={Boolean(wishlist[product.id])}
                      onAddToCart={addToCart}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="trust" id="avantages">
              <div className="container trust-grid">
                {trustPoints.map((point) => (
                  <div className="trust-card" key={point.title}>
                    <span className="trust-icon"><Icon name={point.icon} /></span>
                    <h3>{point.title}</h3>
                    <p>{point.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="newsletter" id="promotions">
              <div className="container newsletter-inner">
                <div className="newsletter-text">
                  <h2>Recevez les meilleures offres</h2>
                  <p>
                    Soyez informé des nouveaux produits, des promotions des boutiques,
                    des ventes flash et des meilleures opportunités du marché.
                  </p>
                </div>
                {newsletterSent ? (
                  <p className="newsletter-success">
                    <Icon name="icon-check" />
                    Merci ! Votre inscription a bien été prise en compte.
                  </p>
                ) : (
                  <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                    <label className="visually-hidden" htmlFor="newsletter-email">Adresse e-mail</label>
                    <div className="input-group">
                      <Icon name="icon-mail" />
                      <input
                        id="newsletter-email"
                        type="email"
                        placeholder="Entrez votre adresse e-mail"
                        value={newsletterEmail}
                        onChange={(event) => setNewsletterEmail(event.target.value)}
                        required
                      />
                    </div>
                    <button className="btn btn-primary" type="submit">S'abonner</button>
                  </form>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
<a href="#top" className="brand" onClick={goHome}>
  <img src="../img.jpg" alt="ASSIGAME" className="brand-logo"/>
  <span className="brand-name">ASSIGAME</span>
</a>
            <p>
              ASSIGAME est une marketplace moderne qui met en relation acheteurs et vendeurs.
              Découvrez des milliers de produits proposés par des boutiques vérifiées
              dans un environnement simple, rapide et sécurisé.
            </p>
            <div className="social-links">
              <a className="icon-btn" href="#top" aria-label="Discord"><Icon name="icon-discord" /></a>
              <a className="icon-btn" href="#top" aria-label="Twitch"><Icon name="icon-twitch" /></a>
              <a className="icon-btn" href="#top" aria-label="Instagram"><Icon name="icon-instagram" /></a>
              <a className="icon-btn" href="#top" aria-label="X"><Icon name="icon-x" /></a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Marché</h3>
            <ul>
              <li><a href="#categories">Catégories</a></li>
              <li><a href="#produits">Produits</a></li>
              <li><a href="#top">Nouveautés</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>Boutiques</h3>
            <ul>
              <li><a href="#top">Nos boutiques</a></li>
              <li><a href="#top">Devenir vendeur</a></li>
              <li><a href="#top">Créer une boutique</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h3>Assistance</h3>
            <ul>
              <li><a href="#top">Suivi des commandes</a></li>
              <li><a href="#top">Centre d'aide</a></li>
              <li><a href="#top">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© 2026 ASSIGAME. Tous droits réservés.</p>
          <div className="footer-legal">
            <a href="#top">Mentions légales</a>
            <a href="#top">Politique de confidentialité</a>
            <a href="#top">Conditions d'utilisation</a>
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        items={cartItems}
        total={cartTotal}
        ordered={ordered}
        onClose={closeCart}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
        onCheckout={handleCheckout}
      />

      <SearchOverlay
        open={searchOpen}
        query={searchQuery}
        results={searchResults}
        onQueryChange={setSearchQuery}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </>
  )
}

export default App

