'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'

import type { Category } from '../../../../payload/payload-types'
import { useWishlist } from '../../../_providers/Wishlist'
import { useCart } from '../../../_providers/Cart'
import {
  SearchIcon,
  HeartIcon,
  HeartFilledIcon,
  StarIcon,
  XIcon,
  ArrowRightIcon,
  FilterIcon,
} from '../../../_components/Icons'

import classes from './ProductsClientPage.module.scss'

// Rich mock catalog with real ethnic photography & categorization
const MOCK_PRODUCTS = [
  // ── Sarees
  {
    id: '1',
    name: 'Banarasi Silk Saree',
    price: 4999,
    originalPrice: 7500,
    category: 'sarees',
    categoryLabel: 'Sarees',
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: '5',
    name: 'Kanjeevaram Pure Silk Saree',
    price: 8999,
    originalPrice: 12000,
    category: 'sarees',
    categoryLabel: 'Sarees',
    badge: 'New',
    rating: 4.7,
    reviews: 68,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: '9',
    name: 'Chanderi Handloom Silk Saree',
    price: 3499,
    originalPrice: 4500,
    category: 'sarees',
    categoryLabel: 'Sarees',
    badge: null,
    rating: 4.5,
    reviews: 55,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: '13',
    name: 'Georgette Embroidered Saree',
    price: 2799,
    originalPrice: 3999,
    category: 'sarees',
    categoryLabel: 'Sarees',
    badge: 'Sale',
    rating: 4.6,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: true,
  },

  // ── Kurtis
  {
    id: '2',
    name: 'Anarkali Festive Kurti Set',
    price: 1899,
    originalPrice: 2999,
    category: 'kurtis',
    categoryLabel: 'Kurtis',
    badge: 'New',
    rating: 4.6,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: '4',
    name: 'Chanderi Silk Floral Kurti',
    price: 1499,
    originalPrice: 2200,
    category: 'kurtis',
    categoryLabel: 'Kurtis',
    badge: 'Sale',
    rating: 4.5,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: '7',
    name: 'Cotton Hand-Block Printed Kurti',
    price: 799,
    originalPrice: 1200,
    category: 'kurtis',
    categoryLabel: 'Kurtis',
    badge: 'Sale',
    rating: 4.3,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: '10',
    name: 'Flared Palazzo Kurti Ensemble',
    price: 2199,
    originalPrice: 3200,
    category: 'kurtis',
    categoryLabel: 'Kurtis',
    badge: 'New',
    rating: 4.4,
    reviews: 77,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: true,
    isSale: false,
  },

  // ── Lehengas
  {
    id: '3',
    name: 'Bridal Velvet Lehenga Choli',
    price: 12999,
    originalPrice: 18000,
    category: 'lehengas',
    categoryLabel: 'Lehengas',
    badge: 'Premium',
    rating: 4.9,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    id: '6',
    name: 'Party Wear Semi-Stitched Lehenga',
    price: 5999,
    originalPrice: 8500,
    category: 'lehengas',
    categoryLabel: 'Lehengas',
    badge: 'Sale',
    rating: 4.4,
    reviews: 41,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&auto=format&fit=crop',
    inStock: false,
    isNew: false,
    isSale: true,
  },
  {
    id: '14',
    name: 'Silk Brocade Festive Lehenga',
    price: 9499,
    originalPrice: 13500,
    category: 'lehengas',
    categoryLabel: 'Lehengas',
    badge: 'New',
    rating: 4.8,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: true,
    isSale: false,
  },

  // ── Jewellery / Accessories
  {
    id: '11',
    name: 'Antique Temple Gold Jhumkas',
    price: 899,
    originalPrice: 1200,
    category: 'accessories',
    categoryLabel: 'Jewellery',
    badge: 'Bestseller',
    rating: 4.7,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    id: '15',
    name: 'Kundan Choker & Earring Set',
    price: 1899,
    originalPrice: 2600,
    category: 'accessories',
    categoryLabel: 'Jewellery',
    badge: 'Premium',
    rating: 4.9,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: true,
    isSale: false,
  },

  // ── Dupattas
  {
    id: '8',
    name: 'Phulkari Embroidered Silk Dupatta',
    price: 699,
    originalPrice: 999,
    category: 'dupattas',
    categoryLabel: 'Dupattas',
    badge: 'New',
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: '16',
    name: 'Bandhani Zari Border Dupatta',
    price: 849,
    originalPrice: 1199,
    category: 'dupattas',
    categoryLabel: 'Dupattas',
    badge: 'Sale',
    rating: 4.5,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: true,
  },

  // ── Salwar Sets
  {
    id: '12',
    name: 'Bandhani Silk Salwar Suit Set',
    price: 1699,
    originalPrice: 2500,
    category: 'salwar-sets',
    categoryLabel: 'Salwar Sets',
    badge: 'Sale',
    rating: 4.2,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: '17',
    name: 'Chanderi Straight Salwar Suit',
    price: 2499,
    originalPrice: 3499,
    category: 'salwar-sets',
    categoryLabel: 'Salwar Sets',
    badge: 'New',
    rating: 4.7,
    reviews: 51,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format&fit=crop',
    inStock: true,
    isNew: true,
    isSale: false,
  },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'popular', label: 'Most Popular' },
]

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Collections', count: MOCK_PRODUCTS.length },
  { value: 'sarees', label: 'Sarees', count: MOCK_PRODUCTS.filter(p => p.category === 'sarees').length },
  { value: 'kurtis', label: 'Kurtis', count: MOCK_PRODUCTS.filter(p => p.category === 'kurtis').length },
  { value: 'lehengas', label: 'Lehengas', count: MOCK_PRODUCTS.filter(p => p.category === 'lehengas').length },
  { value: 'accessories', label: 'Jewellery', count: MOCK_PRODUCTS.filter(p => p.category === 'accessories').length },
  { value: 'dupattas', label: 'Dupattas', count: MOCK_PRODUCTS.filter(p => p.category === 'dupattas').length },
  { value: 'salwar-sets', label: 'Salwar Sets', count: MOCK_PRODUCTS.filter(p => p.category === 'salwar-sets').length },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <span className={classes.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <StarIcon
          key={i}
          size={12}
          filled={i <= rating}
          color={i <= rating ? 'var(--boutique-gold-500)' : 'var(--theme-border-color)'}
        />
      ))}
    </span>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { addItemToCart, isProductInCart } = useCart()

  const urlCategory = searchParams.get('category') || ''
  const urlSort = searchParams.get('sort') || 'newest'
  const urlSale = searchParams.get('sale') === 'true'
  const urlSearch = searchParams.get('search') || ''

  const [selectedCategory, setSelectedCategory] = useState(urlCategory)
  const [sortBy, setSortBy] = useState(urlSort)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [showSaleOnly, setShowSaleOnly] = useState(urlSale)
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState(urlSearch)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // React to URL query param changes seamlessly
  useEffect(() => {
    setSelectedCategory(urlCategory)
  }, [urlCategory])

  useEffect(() => {
    if (urlSort) setSortBy(urlSort)
  }, [urlSort])

  useEffect(() => {
    setShowSaleOnly(urlSale)
  }, [urlSale])

  useEffect(() => {
    if (urlSearch) setSearchQuery(urlSearch)
  }, [urlSearch])

  // Update category and sync URL
  const handleCategorySelect = (catValue: string) => {
    setSelectedCategory(catValue)
    const params = new URLSearchParams(searchParams.toString())
    if (catValue) {
      params.set('category', catValue)
    } else {
      params.delete('category')
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  // Update sale filter and sync URL
  const handleSaleToggle = (isSale: boolean) => {
    setShowSaleOnly(isSale)
    const params = new URLSearchParams(searchParams.toString())
    if (isSale) {
      params.set('sale', 'true')
    } else {
      params.delete('sale')
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  // Reset all filters
  const handleResetAll = () => {
    setSelectedCategory('')
    setSortBy('newest')
    setPriceRange([0, 20000])
    setShowSaleOnly(false)
    setShowInStockOnly(false)
    setSearchQuery('')
    router.push('/products', { scroll: false })
  }

  // Filtered and sorted products
  const filtered = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => {
      if (selectedCategory && p.category !== selectedCategory) return false
      if (showSaleOnly && !p.isSale) return false
      if (showInStockOnly && !p.inStock) return false
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
        result = [...result].sort((a, b) => b.reviews - a.reviews)
        break
      default:
        result = [...result]
    }
    return result
  }, [selectedCategory, sortBy, priceRange, showSaleOnly, showInStockOnly, searchQuery])

  const toggleWishlist = (product: typeof MOCK_PRODUCTS[0]) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id)
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.categoryLabel,
        image: product.image,
      })
    }
  }

  const activeCategoryTitle =
    CATEGORY_OPTIONS.find(c => c.value === selectedCategory)?.label || 'All Collections'

  return (
    <div className={classes.page}>
      {/* Hero Header */}
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>{activeCategoryTitle}</h1>
        <p className={classes.heroSubtitle}>
          {selectedCategory
            ? `Explore our exclusive handpicked ${activeCategoryTitle.toLowerCase()} collection`
            : 'Discover curated Indian ethnic wear handcrafted with authenticity and grace'}
        </p>

        {/* Category Quick Tabs */}
        <div className={classes.categoryPills}>
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat.value}
              type="button"
              className={[
                classes.categoryPill,
                selectedCategory === cat.value && classes.categoryPillActive,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleCategorySelect(cat.value)}
            >
              {cat.label}
              <span className={classes.pillCount}>({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Search inside hero */}
        <div className={classes.heroSearch}>
          <SearchIcon size={18} color="rgba(255,255,255,0.7)" />
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search sarees, kurtis, lehengas, jewellery..."
            className={classes.heroSearchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={classes.clearSearchBtn}
              aria-label="Clear search"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>

      <div className={classes.layout}>
        {/* Sidebar Filters */}
        <aside
          className={[classes.sidebar, filtersOpen && classes.sidebarOpen]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={classes.sidebarHeader}>
            <h2 className={classes.sidebarTitle}>Filters</h2>
            {(selectedCategory || showSaleOnly || searchQuery || priceRange[1] < 20000) && (
              <button className={classes.clearFilters} onClick={handleResetAll}>
                Clear All
              </button>
            )}
          </div>

          {/* Category Radio filter */}
          <div className={classes.filterGroup}>
            <h3 className={classes.filterLabel}>Collections</h3>
            {CATEGORY_OPTIONS.map(cat => (
              <label key={cat.value} className={classes.filterOption}>
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={selectedCategory === cat.value}
                  onChange={() => handleCategorySelect(cat.value)}
                />
                <span className={classes.filterOptionLabel}>{cat.label}</span>
                <span className={classes.filterOptionCount}>({cat.count})</span>
              </label>
            ))}
          </div>

          {/* Price range */}
          <div className={classes.filterGroup}>
            <h3 className={classes.filterLabel}>Price Range</h3>
            <div className={classes.priceRange}>
              <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
              <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={0}
              max={20000}
              step={200}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className={classes.rangeSlider}
            />
          </div>

          {/* Availability & Offers */}
          <div className={classes.filterGroup}>
            <h3 className={classes.filterLabel}>Offers &amp; Stock</h3>
            <label className={classes.toggleOption}>
              <input
                type="checkbox"
                checked={showSaleOnly}
                onChange={e => handleSaleToggle(e.target.checked)}
              />
              <span>On Festive Sale</span>
            </label>
            <label className={classes.toggleOption}>
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={e => setShowInStockOnly(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Overlay for mobile filters */}
        {filtersOpen && (
          <div className={classes.sidebarOverlay} onClick={() => setFiltersOpen(false)} />
        )}

        {/* Main Products Grid */}
        <div className={classes.main}>
          {/* Toolbar */}
          <div className={classes.toolbar}>
            <div className={classes.toolbarLeft}>
              <button
                className={classes.filterToggleBtn}
                onClick={() => setFiltersOpen(v => !v)}
              >
                Filters {filtersOpen ? '✕' : '☰'}
              </button>
              <p className={classes.resultCount}>
                Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className={classes.toolbarRight}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className={classes.sortSelect}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className={classes.viewToggle}>
                <button
                  className={[classes.viewBtn, viewMode === 'grid' && classes.viewBtnActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  ⊞
                </button>
                <button
                  className={[classes.viewBtn, viewMode === 'list' && classes.viewBtnActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory || showSaleOnly || searchQuery || priceRange[1] < 20000) && (
            <div className={classes.activeFilters}>
              {selectedCategory && (
                <span className={classes.activeFilter}>
                  Category: {activeCategoryTitle}
                  <button onClick={() => handleCategorySelect('')} aria-label="Remove category filter">
                    <XIcon size={12} />
                  </button>
                </span>
              )}
              {showSaleOnly && (
                <span className={classes.activeFilter}>
                  On Festive Sale
                  <button onClick={() => handleSaleToggle(false)} aria-label="Remove sale filter">
                    <XIcon size={12} />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className={classes.activeFilter}>
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">
                    <XIcon size={12} />
                  </button>
                </span>
              )}
              {priceRange[1] < 20000 && (
                <span className={classes.activeFilter}>
                  Under ₹{priceRange[1].toLocaleString('en-IN')}
                  <button onClick={() => setPriceRange([0, 20000])} aria-label="Reset price filter">
                    <XIcon size={12} />
                  </button>
                </span>
              )}
              <button className={classes.clearAllChipsBtn} onClick={handleResetAll}>
                Clear All
              </button>
            </div>
          )}

          {/* Products Cards */}
          {filtered.length === 0 ? (
            <div className={classes.noResults}>
              <div className={classes.noResultsIcon}>
                <SearchIcon size={40} color="var(--theme-text-muted)" />
              </div>
              <h3>No products found in this selection</h3>
              <p>Try selecting a different category or clearing your search filters.</p>
              <button onClick={handleResetAll} className={classes.resetBtn}>
                View All Collections
              </button>
            </div>
          ) : (
            <div
              className={[
                classes.productsGrid,
                viewMode === 'list' && classes.productsGridList,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {filtered.map(product => {
                const discount = Math.round(
                  (1 - product.price / product.originalPrice) * 100,
                )
                const wishlisted = isInWishlist(product.id)

                return (
                  <div key={product.id} className={classes.productCard}>
                    <div className={classes.productImg}>
                      <div className={classes.productImgInner}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width:768px) 50vw, 25vw"
                          className={classes.productPhoto}
                        />
                      </div>

                      {product.badge && (
                        <span
                          className={`${classes.badge} ${classes[`badge${product.badge}`]}`}
                        >
                          {product.badge}
                        </span>
                      )}
                      {!product.inStock && (
                        <span className={classes.outOfStock}>Out of Stock</span>
                      )}

                      <div className={classes.productHover}>
                        <Link
                          href={`/products/${product.id}`}
                          className={classes.quickView}
                        >
                          Quick View
                        </Link>
                      </div>

                      <button
                        className={[
                          classes.wishlistBtn,
                          wishlisted && classes.wishlistBtnActive,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          wishlisted
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                        }
                      >
                        {wishlisted ? (
                          <HeartFilledIcon size={16} color="hsl(350,70%,55%)" />
                        ) : (
                          <HeartIcon size={16} />
                        )}
                      </button>
                    </div>

                    <div className={classes.productInfo}>
                      <p className={classes.productCat}>{product.categoryLabel}</p>
                      <h3 className={classes.productName}>
                        <Link href={`/products/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <div className={classes.productRating}>
                        <StarRating rating={product.rating} />
                        <span>({product.reviews})</span>
                      </div>
                      <div className={classes.productPrice}>
                        <span className={classes.priceNow}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className={classes.priceOld}>
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className={classes.priceSave}>{discount}% off</span>
                      </div>
                      <div className={classes.productActions}>
                        {isProductInCart({ id: product.id } as any) ? (
                          <Link href="/cart" className={`${classes.addCartBtn} ${classes.inCartBtn}`}>
                            ✓ In Bag — View Cart
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled={!product.inStock}
                            onClick={() => {
                              addItemToCart({
                                product: {
                                  id: String(product.id),
                                  title: product.name,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  meta: { image: product.image },
                                } as any,
                                quantity: 1,
                              })
                            }}
                            className={[
                              classes.addCartBtn,
                              !product.inStock && classes.addCartBtnDisabled,
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProductsClientPage({ categories, searchParams }: { categories: Category[] | null; searchParams?: Record<string, string | string[]> }) {
  return (
    <Suspense fallback={<div className={classes.loadingFallback}>Loading collections...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
