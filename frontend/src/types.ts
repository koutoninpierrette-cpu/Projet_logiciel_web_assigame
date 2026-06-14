export type Product = {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  badge?: 'Nouveau' | 'Promo' | 'Best-seller'
  accent: 'cyan' | 'blue' | 'amber' | 'green'
  icon: string
  image?: string | null
  shopId?: string
  shopName?: string
  shopPhone?: string | null
}

export type Category = {
  id: string
  name: string
  description: string
  icon: string
  count: string
}

export type Shop = {
  id: string
  rawId: number
  name: string
  description: string
  logo?: string | null
  ownerName: string
  productCount: number
  createdAt: string
}
