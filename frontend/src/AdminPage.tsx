import { useEffect, useState, type FormEvent } from 'react'
import { Icon } from './icons'
import {
  ApiError,
  createCategorie,
  deleteBoutique,
  deleteCategorie,
  deleteProduit,
  deleteUtilisateur,
  fetchBoutiques,
  fetchCategories,
  fetchProduits,
  fetchUtilisateurs,
  type ApiBoutique,
  type ApiCategorie,
  type ApiProduit,
  type ApiUtilisateur,
} from './api'

type Tab = 'users' | 'shops' | 'products' | 'categories'

function AdminPage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('users')
  const [users, setUsers] = useState<ApiUtilisateur[]>([])
  const [shops, setShops] = useState<ApiBoutique[]>([])
  const [products, setProducts] = useState<ApiProduit[]>([])
  const [categories, setCategories] = useState<ApiCategorie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [categoryError, setCategoryError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    setError(null)
    try {
      const [apiUsers, apiShops, apiProducts, apiCategories] = await Promise.all([
        fetchUtilisateurs(),
        fetchBoutiques(),
        fetchProduits(),
        fetchCategories(),
      ])
      setUsers(apiUsers)
      setShops(apiShops)
      setProducts(apiProducts)
      setCategories(apiCategories)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de charger les données.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleDeleteUser(id: number) {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await deleteUtilisateur(id)
      setUsers((current) => current.filter((user) => user.id_utilisateur !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Suppression impossible.')
    }
  }

  async function handleDeleteShop(id: number) {
    if (!confirm('Supprimer cette boutique ?')) return
    try {
      await deleteBoutique(id)
      setShops((current) => current.filter((shop) => shop.id_boutique !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Suppression impossible.')
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      await deleteProduit(id)
      setProducts((current) => current.filter((product) => product.id_produit !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Suppression impossible.')
    }
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm('Supprimer cette catégorie ?')) return
    try {
      await deleteCategorie(id)
      setCategories((current) => current.filter((category) => category.idcategorie_produit !== id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Suppression impossible.')
    }
  }

  async function handleCreateCategory(event: FormEvent) {
    event.preventDefault()
    setCategoryError(null)

    if (!newCategoryName.trim()) {
      setCategoryError('Le nom de la catégorie est requis.')
      return
    }

    try {
      const category = await createCategorie({
        nom_categorieproduit: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      })
      setCategories((current) => [...current, category])
      setNewCategoryName('')
      setNewCategoryDescription('')
    } catch (err) {
      setCategoryError(err instanceof ApiError ? err.message : 'Impossible de créer la catégorie.')
    }
  }

  return (
    <section className="admin-page">
      <div className="container">
        <button className="link-back" type="button" onClick={onBack}>
          <Icon name="icon-arrow-right" className="icon-flip" />
          Retour
        </button>

        <div className="section-head">
          <div>
            <span className="section-tag">Administration</span>
            <h2>Tableau de bord</h2>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="admin-tabs">
          <button type="button" className={`admin-tab${tab === 'users' ? ' active' : ''}`} onClick={() => setTab('users')}>
            Utilisateurs ({users.length})
          </button>
          <button type="button" className={`admin-tab${tab === 'shops' ? ' active' : ''}`} onClick={() => setTab('shops')}>
            Boutiques ({shops.length})
          </button>
          <button type="button" className={`admin-tab${tab === 'products' ? ' active' : ''}`} onClick={() => setTab('products')}>
            Produits ({products.length})
          </button>
          <button type="button" className={`admin-tab${tab === 'categories' ? ' active' : ''}`} onClick={() => setTab('categories')}>
            Catégories ({categories.length})
          </button>
        </div>

        {loading ? (
          <p className="empty-state">Chargement…</p>
        ) : (
          <div className="admin-content">
            {tab === 'users' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Login</th>
                    <th>Téléphone</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id_utilisateur}>
                      <td>{user.id_utilisateur}</td>
                      <td>{user.Prenom} {user.Nom}</td>
                      <td>{user.Email}</td>
                      <td>{user.Login}</td>
                      <td>{user.telephone ?? '—'}</td>
                      <td>{user.statut}</td>
                      <td>
                        <button type="button" className="admin-delete" onClick={() => handleDeleteUser(user.id_utilisateur)}>
                          <Icon name="icon-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'shops' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Propriétaire</th>
                    <th>Statut</th>
                    <th>Créée le</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop) => (
                    <tr key={shop.id_boutique}>
                      <td>{shop.id_boutique}</td>
                      <td>{shop.nom_boutique}</td>
                      <td>{shop.utilisateur ? `${shop.utilisateur.Prenom} ${shop.utilisateur.Nom}` : '—'}</td>
                      <td>{shop.statut}</td>
                      <td>{new Date(shop.date_creation).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <button type="button" className="admin-delete" onClick={() => handleDeleteShop(shop.id_boutique)}>
                          <Icon name="icon-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'products' && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Catégorie</th>
                    <th>Boutique</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id_produit}>
                      <td>{product.id_produit}</td>
                      <td>{product.nom_produit}</td>
                      <td>{product.prix.toFixed(2)} FCFA</td>
                      <td>{product.categorieProduit?.nom_categorieproduit ?? '—'}</td>
                      <td>{product.boutique?.nom_boutique ?? '—'}</td>
                      <td>{product.statut}</td>
                      <td>
                        <button type="button" className="admin-delete" onClick={() => handleDeleteProduct(product.id_produit)}>
                          <Icon name="icon-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'categories' && (
              <>
                <form className="shop-form admin-category-form" onSubmit={handleCreateCategory}>
                  <div className="input-row">
                    <div>
                      <label htmlFor="admin-category-name">Nom</label>
                      <input
                        id="admin-category-name"
                        type="text"
                        value={newCategoryName}
                        onChange={(event) => setNewCategoryName(event.target.value)}
                        placeholder="Ex: Maison connectée"
                      />
                    </div>
                    <div>
                      <label htmlFor="admin-category-description">Description</label>
                      <input
                        id="admin-category-description"
                        type="text"
                        value={newCategoryDescription}
                        onChange={(event) => setNewCategoryDescription(event.target.value)}
                        placeholder="Optionnel"
                      />
                    </div>
                  </div>
                  {categoryError && <p className="form-error">{categoryError}</p>}
                  <button className="btn btn-primary btn-sm" type="submit">
                    Ajouter la catégorie
                  </button>
                </form>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Description</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.idcategorie_produit}>
                        <td>{category.idcategorie_produit}</td>
                        <td>{category.nom_categorieproduit}</td>
                        <td>{category.description ?? '—'}</td>
                        <td>
                          <button type="button" className="admin-delete" onClick={() => handleDeleteCategory(category.idcategorie_produit)}>
                            <Icon name="icon-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminPage
