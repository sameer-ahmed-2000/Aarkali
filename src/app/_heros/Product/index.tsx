'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Category, Product } from '../../../payload/payload-types'
import { CatalogProduct, getRelatedProducts } from '../../constants/catalog'
import { Gutter } from '../../_components/Gutter'
import { Media } from '../../_components/Media'
import { useWishlist } from '../../_providers/Wishlist'
import { useCart } from '../../_providers/Cart'
import {
  StarIcon,
  TruckIcon,
  RefreshIcon,
  ShieldIcon,
  CreditCardIcon,
  HeartIcon,
  HeartFilledIcon,
  CheckIcon,
  ChevronRightIcon,
  XIcon,
  ArrowRightIcon,
  CartIcon,
  TagIcon,
} from '../../_components/Icons'

import classes from './index.module.scss'

interface ProductHeroProps {
  product: Product
  catalogData?: CatalogProduct | null
}

const SIZE_GUIDE_DATA = [
  { size: 'XS', bust: '32"', waist: '26"', hip: '36"', length: '44"' },
  { size: 'S', bust: '34"', waist: '28"', hip: '38"', length: '44"' },
  { size: 'M', bust: '36"', waist: '30"', hip: '40"', length: '45"' },
  { size: 'L', bust: '38"', waist: '32"', hip: '42"', length: '45"' },
  { size: 'XL', bust: '40"', waist: '34"', hip: '44"', length: '46"' },
  { size: 'XXL', bust: '42"', waist: '36"', hip: '46"', length: '46"' },
]

export const ProductHero: React.FC<ProductHeroProps> = ({ product, catalogData }) => {
  const router = useRouter()
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { addItemToCart, isProductInCart } = useCart()

  // Product field extraction with fallbacks
  const title = product?.title || catalogData?.name || 'Handcrafted Ethnic Attire'
  const categoryName =
    catalogData?.categoryLabel ||
    ((product?.categories?.[0] as Category)?.title) ||
    'Ethnic Wear'
  const categorySlug = catalogData?.category || 'sarees'

  // Pricing calculations
  const price =
    catalogData?.price ||
    (typeof product?.priceJSON === 'string'
      ? Math.round(JSON.parse(product.priceJSON)?.data?.[0]?.unit_amount / 100 || 2999)
      : 2999)

  const originalPrice =
    catalogData?.originalPrice || Math.round(price * 1.45)

  const discount = Math.round((1 - price / originalPrice) * 100)

  // Images gallery
  const defaultImage =
    catalogData?.image ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85&auto=format&fit=crop'
  
  const galleryImages = catalogData?.additionalImages && catalogData.additionalImages.length > 0
    ? catalogData.additionalImages
    : [defaultImage]

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(catalogData?.sizes?.[0] || 'M')
  const [quantity, setQuantity] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'desc' | 'fabric' | 'care' | 'shipping'>('desc')
  const [addedNotice, setAddedNotice] = useState(false)

  const productId = String(product?.id || catalogData?.id || '1')
  const wishlisted = isInWishlist(productId)

  const cartProduct = {
    id: productId,
    title,
    name: title,
    price,
    image: galleryImages[0] || defaultImage,
    meta: {
      image: galleryImages[0] || defaultImage,
      description: catalogData?.shortDescription || product?.meta?.description || '',
    },
  } as any

  const inCart = isProductInCart(cartProduct)

  const toggleWishlist = () => {
    if (wishlisted) {
      removeItem(productId)
    } else {
      addItem({
        id: productId,
        name: title,
        price,
        originalPrice,
        category: categoryName,
        image: galleryImages[0] || defaultImage,
      })
    }
  }

  const handleAddToCart = () => {
    addItemToCart({
      product: cartProduct,
      quantity,
    })
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 3000)
  }

  const handleBuyNow = () => {
    addItemToCart({
      product: cartProduct,
      quantity,
    })
    router.push('/checkout')
  }

  const availableSizes = catalogData?.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const isFreeSize = availableSizes.some(s => s.toLowerCase().includes('free') || s.toLowerCase().includes('unstitched') || s.toLowerCase().includes('semi'))

  const highlights = catalogData?.highlights || [
    'Handcrafted by traditional master weavers with authenticated craft mark',
    'Premium quality natural textile with rich metallic zari detailing',
    'Includes complimentary matching blouse / styling coordinates',
    'Packaged in signature Aarkali luxury protective dust bag',
  ]

  const relatedProducts = getRelatedProducts(productId, categorySlug, 4)

  return (
    <div className={classes.productHeroWrapper}>
      {/* ── Breadcrumbs ───────────────────────────────────────── */}
      <div className={classes.breadcrumbBar}>
        <Gutter className={classes.breadcrumbInner}>
          <Link href="/" className={classes.breadcrumbLink}>Home</Link>
          <ChevronRightIcon size={12} />
          <Link href="/products" className={classes.breadcrumbLink}>Collections</Link>
          <ChevronRightIcon size={12} />
          <Link href={`/products?category=${categorySlug}`} className={classes.breadcrumbLink}>{categoryName}</Link>
          <ChevronRightIcon size={12} />
          <span className={classes.breadcrumbCurrent}>{title}</span>
        </Gutter>
      </div>

      <Gutter className={classes.productHero}>
        {/* ── Left: Image Gallery ──────────────────────────────── */}
        <div className={classes.galleryColumn}>
          <div className={classes.mainImageWrapper}>
            <Image
              src={galleryImages[activeImageIndex] || defaultImage}
              alt={title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              className={classes.mainImage}
            />
            {catalogData?.badge && (
              <span className={`${classes.badge} ${classes[`badge${catalogData.badge}`]}`}>
                {catalogData.badge}
              </span>
            )}
            <button
              type="button"
              className={[classes.wishlistOverlayBtn, wishlisted && classes.wishlistOverlayBtnActive]
                .filter(Boolean)
                .join(' ')}
              onClick={toggleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlisted ? (
                <HeartFilledIcon size={20} color="hsl(350,70%,55%)" />
              ) : (
                <HeartIcon size={20} />
              )}
            </button>
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className={classes.thumbnails}>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={[classes.thumbnailBtn, idx === activeImageIndex && classes.thumbnailBtnActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill className={classes.thumbnailImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Details & Purchase Actions ─────────── */}
        <div className={classes.detailsColumn}>
          {/* Category & Ratings */}
          <div className={classes.metaTop}>
            <span className={classes.categoryBadge}>{categoryName}</span>
            <div className={classes.ratingBadge}>
              <div className={classes.stars}>
                {[1, 2, 3, 4, 5].map(i => (
                  <StarIcon
                    key={i}
                    size={14}
                    filled={i <= Math.round(catalogData?.rating || 4.8)}
                    color="var(--boutique-gold-500)"
                  />
                ))}
              </div>
              <span className={classes.ratingText}>
                {catalogData?.rating || 4.8} ({catalogData?.reviews || 86} reviews)
              </span>
            </div>
          </div>

          {/* Product Title & SKU */}
          <h1 className={classes.title}>{title}</h1>
          <p className={classes.skuText}>SKU: {catalogData?.sku || 'AAR-BOUTIQUE-01'}</p>

          {/* Pricing Box */}
          <div className={classes.pricingCard}>
            <div className={classes.priceRow}>
              <span className={classes.currentPrice}>₹{price.toLocaleString('en-IN')}</span>
              <span className={classes.originalPrice}>₹{originalPrice.toLocaleString('en-IN')}</span>
              <span className={classes.discountPill}>{discount}% OFF</span>
            </div>
            <div className={classes.taxShippingNotice}>
              <span>✓ Inclusive of all taxes</span>
              <span>·</span>
              <span className={classes.freeShippingText}>
                <TruckIcon size={14} /> FREE Express Shipping
              </span>
            </div>
          </div>

          {/* Short description */}
          <p className={classes.shortDesc}>
            {catalogData?.shortDescription ||
              catalogData?.description ||
              product?.meta?.description ||
              'Handcrafted boutique design made with pure authentic materials, tailored for festive celebrations.'}
          </p>

          {/* Size Selection */}
          <div className={classes.sizeSection}>
            <div className={classes.sizeHeader}>
              <span className={classes.sizeLabel}>
                {isFreeSize ? 'Size / Drape:' : 'Select Size:'} <strong>{selectedSize}</strong>
              </span>
              {!isFreeSize && (
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className={classes.sizeGuideBtn}
                >
                  Size Guide &amp; Measurements
                </button>
              )}
            </div>

            <div className={classes.sizeGrid}>
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  className={[
                    classes.sizeBtn,
                    selectedSize === size && classes.sizeBtnActive,
                    isFreeSize && classes.sizeBtnFree,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Stock status */}
          <div className={classes.qtyRow}>
            <div className={classes.qtyStepper}>
              <button
                type="button"
                className={classes.qtyBtn}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className={classes.qtyValue}>{quantity}</span>
              <button
                type="button"
                className={classes.qtyBtn}
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                disabled={quantity >= 10}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <span className={classes.inStockBadge}>
              <CheckIcon size={14} /> In Stock &amp; Ready for Express Dispatch
            </span>
          </div>

          {/* Added to Bag Toast */}
          {addedNotice && (
            <div className={classes.toastNotice}>
              <CheckIcon size={16} /> Added {quantity} item(s) to your shopping bag!
            </div>
          )}

          {/* CTA Buttons */}
          <div className={classes.actionButtons}>
            <button
              type="button"
              onClick={handleAddToCart}
              className={`${classes.addToCartBtn} ${inCart ? classes.inCartState : ''}`}
            >
              <CartIcon size={18} />
              {inCart ? 'Add More to Bag' : 'Add to Bag'}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className={classes.buyNowBtn}
            >
              Buy Now — Instant Checkout <ArrowRightIcon size={16} />
            </button>
          </div>

          {/* Boutique Reassurances */}
          <div className={classes.perksGrid}>
            <div className={classes.perkCard}>
              <TruckIcon size={18} />
              <div>
                <strong>Free Express Shipping</strong>
                <p>On orders above ₹999 across India</p>
              </div>
            </div>

            <div className={classes.perkCard}>
              <CreditCardIcon size={18} />
              <div>
                <strong>Cash on Delivery (COD)</strong>
                <p>Pay comfortably at your doorstep</p>
              </div>
            </div>

            <div className={classes.perkCard}>
              <RefreshIcon size={18} />
              <div>
                <strong>7-Day Easy Returns</strong>
                <p>Hassle-free exchanges &amp; size swaps</p>
              </div>
            </div>

            <div className={classes.perkCard}>
              <ShieldIcon size={18} />
              <div>
                <strong>100% Handcrafted</strong>
                <p>Direct from traditional Indian artisans</p>
              </div>
            </div>
          </div>

          {/* ── Product Information Tabs ────────────────────────── */}
          <div className={classes.infoTabsSection}>
            <div className={classes.tabsHeader}>
              <button
                type="button"
                className={[classes.tabBtn, activeTab === 'desc' && classes.tabBtnActive]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActiveTab('desc')}
              >
                Description &amp; Highlights
              </button>
              <button
                type="button"
                className={[classes.tabBtn, activeTab === 'fabric' && classes.tabBtnActive]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActiveTab('fabric')}
              >
                Fabric &amp; Craft
              </button>
              <button
                type="button"
                className={[classes.tabBtn, activeTab === 'care' && classes.tabBtnActive]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActiveTab('care')}
              >
                Wash &amp; Care
              </button>
              <button
                type="button"
                className={[classes.tabBtn, activeTab === 'shipping' && classes.tabBtnActive]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping &amp; Returns
              </button>
            </div>

            <div className={classes.tabContent}>
              {activeTab === 'desc' && (
                <div className={classes.tabPane}>
                  <p className={classes.tabDescText}>
                    {catalogData?.description ||
                      product?.meta?.description ||
                      'Elevate your ethnic wardrobe with this handcrafted masterpiece. Expertly designed to offer graceful draping and unmatched elegance.'}
                  </p>
                  <h4 className={classes.highlightsTitle}>Product Highlights</h4>
                  <ul className={classes.highlightsList}>
                    {highlights.map((item, i) => (
                      <li key={i}>
                        <CheckIcon size={14} className={classes.checkIcon} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'fabric' && (
                <div className={classes.tabPane}>
                  <div className={classes.specRow}>
                    <span className={classes.specLabel}>Fabric Composition</span>
                    <strong className={classes.specValue}>{catalogData?.fabric || 'Pure Mulberry Silk & Cotton Blend'}</strong>
                  </div>
                  <div className={classes.specRow}>
                    <span className={classes.specLabel}>Artisanal Craft</span>
                    <strong className={classes.specValue}>{catalogData?.craft || 'Traditional Handloom Weaving'}</strong>
                  </div>
                  <div className={classes.specRow}>
                    <span className={classes.specLabel}>Origin</span>
                    <strong className={classes.specValue}>India (Varanasi / Kanchipuram / Jaipur Ateliers)</strong>
                  </div>
                  <div className={classes.specRow}>
                    <span className={classes.specLabel}>Certification</span>
                    <strong className={classes.specValue}>100% Authentic Handcrafted Quality Guarantee</strong>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className={classes.tabPane}>
                  <p className={classes.tabDescText}>
                    {catalogData?.care || 'Dry clean only. Store wrapped in a soft breathable cotton or muslin cloth away from direct sunlight.'}
                  </p>
                  <ul className={classes.careList}>
                    <li>Do not spray perfume or deodorants directly onto zari or metallic embroidery.</li>
                    <li>Always dry clean silk, brocade, and velvet outfits to preserve their luster.</li>
                    <li>Iron on the reverse side using medium heat or steam vertically.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className={classes.tabPane}>
                  <div className={classes.shippingPerks}>
                    <div className={classes.shippingItem}>
                      <strong>Free Express Delivery</strong>
                      <p>Orders above ₹999 are delivered free within 3-5 business days across India.</p>
                    </div>
                    <div className={classes.shippingItem}>
                      <strong>Cash on Delivery (COD)</strong>
                      <p>Available on all orders. Pay with cash or UPI on delivery.</p>
                    </div>
                    <div className={classes.shippingItem}>
                      <strong>7-Day Easy Returns &amp; Exchanges</strong>
                      <p>Hassle-free size swaps and returns with doorstep courier pickup.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Gutter>

      {/* ── Related Products ─────────────────────────────────── */}
      <section className={classes.relatedSection}>
        <Gutter>
          <div className={classes.sectionHeader}>
            <p className={classes.sectionLabel}>Complete Your Look</p>
            <h2 className={classes.sectionTitle}>You May Also Love</h2>
          </div>

          <div className={classes.relatedGrid}>
            {relatedProducts.map(rel => {
              const relDiscount = Math.round((1 - rel.price / rel.originalPrice) * 100)
              return (
                <div key={rel.id} className={classes.relatedCard}>
                  <div className={classes.relatedImageWrap}>
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={classes.relatedImage}
                    />
                    <Link
                      href={`/products/${rel.slug || rel.id}`}
                      className={classes.relatedQuickView}
                    >
                      Quick View
                    </Link>
                  </div>
                  <div className={classes.relatedInfo}>
                    <p className={classes.relatedCat}>{rel.categoryLabel}</p>
                    <h3 className={classes.relatedName}>
                      <Link href={`/products/${rel.slug || rel.id}`}>{rel.name}</Link>
                    </h3>
                    <div className={classes.relatedPricing}>
                      <span className={classes.relatedPrice}>₹{rel.price.toLocaleString('en-IN')}</span>
                      <span className={classes.relatedOriginal}>₹{rel.originalPrice.toLocaleString('en-IN')}</span>
                      <span className={classes.relatedDiscount}>{relDiscount}% off</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Gutter>
      </section>

      {/* ── Size Guide Modal ─────────────────────────────────── */}
      {sizeGuideOpen && (
        <div className={classes.modalOverlay} onClick={() => setSizeGuideOpen(false)}>
          <div className={classes.modalCard} onClick={e => e.stopPropagation()}>
            <div className={classes.modalHeader}>
              <h3 className={classes.modalTitle}>Ethnic Wear Sizing Guide</h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className={classes.modalCloseBtn}
                aria-label="Close size guide"
              >
                <XIcon size={18} />
              </button>
            </div>
            <p className={classes.modalSubtitle}>
              All measurements are in inches. For custom tailoring assistance, contact our boutique stylists.
            </p>

            <table className={classes.sizeTable}>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust</th>
                  <th>Waist</th>
                  <th>Hip</th>
                  <th>Kurta Length</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE_DATA.map(row => (
                  <tr key={row.size} className={selectedSize === row.size ? classes.activeRow : ''}>
                    <td><strong>{row.size}</strong></td>
                    <td>{row.bust}</td>
                    <td>{row.waist}</td>
                    <td>{row.hip}</td>
                    <td>{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={classes.modalFooter}>
              <p>💡 Tip: If you fall between two sizes, we recommend choosing the larger size for standard ethnic comfort.</p>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className={classes.modalDoneBtn}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
