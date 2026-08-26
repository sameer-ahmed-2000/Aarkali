'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowRightIcon, CheckIcon, TruckIcon, RefreshIcon, ShieldIcon, CreditCardIcon,
  StarIcon, HeartIcon, HeartFilledIcon, ClockIcon, ZapIcon, AwardIcon,
  UsersIcon, HandcraftedIcon, ChevronRightIcon, ChevronLeftIcon, PackageIcon,
  SareeIcon, KurtiIcon, LehengaIcon, JewelleryIcon, DupattaIcon, SalwarIcon,
} from '../Icons'

import { useCart } from '../../_providers/Cart'

import classes from './HomePage.module.scss'

// ─── Real Image Data ──────────────────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    tag: 'New Collection 2024',
    title: 'The Art of\nElegance',
    subtitle: 'Handcrafted ethnic wear that celebrates the timeless beauty of Indian fashion.',
    cta: { label: 'Explore Collection', href: '/products' },
    secondaryCta: { label: 'New Arrivals', href: '/products?sort=newest' },
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=85&auto=format&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(10,4,22,0.92) 40%, rgba(10,4,22,0.55) 100%)',
  },
  {
    id: 2,
    tag: 'Designer Sarees',
    title: 'Draped in\nDivinity',
    subtitle: 'Exquisite silk and chiffon sarees for every celebration and occasion.',
    cta: { label: 'Shop Sarees', href: '/products?category=sarees' },
    secondaryCta: { label: 'View Lookbook', href: '/products' },
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85&auto=format&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(10,4,22,0.90) 40%, rgba(10,4,22,0.50) 100%)',
  },
  {
    id: 3,
    tag: 'Festive Season — Up to 40% Off',
    title: 'Celebrate in\nStyle',
    subtitle: 'Lehengas, kurtis and accessories for every festive occasion across India.',
    cta: { label: 'Shop the Sale', href: '/products?sale=true' },
    secondaryCta: { label: 'All Collections', href: '/products' },
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=900&q=85&auto=format&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(10,4,22,0.90) 40%, rgba(10,4,22,0.50) 100%)',
  },
]

const categories = [
  {
    label: 'Sarees',
    href: '/products?category=sarees',
    description: 'Silk, chiffon & woven',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80&auto=format&fit=crop',
    Icon: SareeIcon,
  },
  {
    label: 'Kurtis',
    href: '/products?category=kurtis',
    description: 'Casual & festive wear',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&auto=format&fit=crop',
    Icon: KurtiIcon,
  },
  {
    label: 'Lehengas',
    href: '/products?category=lehengas',
    description: 'Bridal & party wear',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&q=80&auto=format&fit=crop',
    Icon: LehengaIcon,
  },
  {
    label: 'Jewellery',
    href: '/products?category=accessories',
    description: 'Temple & fashion pieces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80&auto=format&fit=crop',
    Icon: JewelleryIcon,
  },
  {
    label: 'Dupattas',
    href: '/products?category=dupattas',
    description: 'Embroidered & printed',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&auto=format&fit=crop',
    Icon: DupattaIcon,
  },
  {
    label: 'Salwar Sets',
    href: '/products?category=salwar-sets',
    description: 'Everyday elegance',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80&auto=format&fit=crop',
    Icon: SalwarIcon,
  },
]

const featuredProducts = [
  {
    id: 1,
    slug: 'banarasi-silk-saree',
    name: 'Banarasi Silk Saree',
    price: 4999,
    originalPrice: 7500,
    category: 'Sarees',
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    slug: 'anarkali-festive-kurti-set',
    name: 'Anarkali Kurti Set',
    price: 1899,
    originalPrice: 2999,
    category: 'Kurtis',
    badge: 'New',
    rating: 4.6,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 3,
    slug: 'bridal-velvet-lehenga-choli',
    name: 'Bridal Lehenga Choli',
    price: 12999,
    originalPrice: 18000,
    category: 'Lehengas',
    badge: 'Premium',
    rating: 4.9,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    slug: 'chanderi-silk-floral-kurti',
    name: 'Chanderi Silk Kurti',
    price: 1499,
    originalPrice: 2200,
    category: 'Kurtis',
    badge: 'Sale',
    rating: 4.5,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80&auto=format&fit=crop',
  },
]

const newArrivals = [
  { id: 5, name: 'Pastel Silk Saree', category: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80&auto=format&fit=crop' },
  { id: 6, name: 'Embroidered Kurti', category: 'Kurtis', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80&auto=format&fit=crop' },
  { id: 7, name: 'Heavy Lehenga', category: 'Lehengas', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500&q=80&auto=format&fit=crop' },
  { id: 8, name: 'Designer Jewellery', category: 'Accessories', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80&auto=format&fit=crop' },
  { id: 9, name: 'Bandhani Dupatta', category: 'Dupattas', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80&auto=format&fit=crop' },
  { id: 10, name: 'Cotton Salwar Set', category: 'Salwar Sets', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80&auto=format&fit=crop' },
]

const testimonials = [
  { name: 'Priya Sharma', city: 'Chennai', initials: 'PS', text: 'Absolutely stunning quality! The Banarasi saree I ordered was even more beautiful in person. Fast delivery and excellent packaging.', rating: 5 },
  { name: 'Meena Krishnan', city: 'Bangalore', initials: 'MK', text: 'The lehenga arrived within 2 days and fits perfectly. The fabric quality is superb. Will definitely order again from Aarkali!', rating: 5 },
  { name: 'Anitha Reddy', city: 'Hyderabad', initials: 'AR', text: 'Best boutique online! COD option made it easy to order. The saree colors are exactly as shown in the photos.', rating: 5 },
  { name: 'Kavitha Nair', city: 'Kochi', initials: 'KN', text: 'Exceptional customer service and amazing designs. The kurti set I ordered was of premium quality at such an affordable price!', rating: 5 },
  { name: 'Divya Menon', city: 'Coimbatore', initials: 'DM', text: 'Ordered a bridal lehenga and was blown away by the craftsmanship. Highly recommend Aarkali Boutique for special occasions!', rating: 5 },
]

const perks = [
  { Icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders above ₹999 across India' },
  { Icon: RefreshIcon, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
  { Icon: CreditCardIcon, title: 'Cash on Delivery', desc: 'Pay comfortably when order arrives' },
  { Icon: ShieldIcon, title: 'Secure Payment', desc: '100% safe via Razorpay' },
]

const whyUs = [
  { Icon: HandcraftedIcon, title: 'Curated Collections', desc: 'Every piece handpicked by our expert stylists for quality and authenticity.' },
  { Icon: AwardIcon, title: 'Direct from Artisans', desc: 'We work directly with skilled weavers and craftsmen across India.' },
  { Icon: PackageIcon, title: 'Careful Packaging', desc: 'Every order is beautifully wrapped and packed to ensure safe delivery.' },
  { Icon: UsersIcon, title: 'Trusted by Thousands', desc: 'Over 10,000 happy customers across India and counting.' },
]

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({ hours: Math.floor(diff / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

function CountdownTimer() {
  const target = useRef(new Date(Date.now() + 12 * 3600000))
  const { hours, minutes, seconds } = useCountdown(target.current)
  const pad = (n: number) => String(n).padStart(2, '0')
  const units = [['Hours', hours], ['Mins', minutes], ['Secs', seconds]]
  return (
    <div className={classes.countdown}>
      {units.map(([label, val], i) => (
        <React.Fragment key={label as string}>
          <div className={classes.countdownUnit}>
            <span className={classes.countdownNumber}>{pad(val as number)}</span>
            <span className={classes.countdownLabel}>{label}</span>
          </div>
          {i < 2 && <span className={classes.countdownSep}>:</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <span className={classes.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <StarIcon key={i} size={12} filled={i <= rating} color={i <= rating ? 'var(--boutique-gold-500)' : 'var(--theme-border-color)'} />
      ))}
    </span>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof featuredProducts[0] }) {
  const [wishlisted, setWishlisted] = useState(false)
  const { addItemToCart, isProductInCart } = useCart()
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  const cartProduct = {
    id: String(product.id),
    title: product.name,
    name: product.name,
    price: product.price,
    image: product.image,
    meta: {
      image: product.image,
    },
  } as any

  const inCart = isProductInCart(cartProduct)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItemToCart({
      product: cartProduct,
      quantity: 1,
    })
  }

  return (
    <div className={classes.productCard}>
      <div className={classes.productImageWrap}>
        <div className={classes.productImageInner}>
          <Image src={product.image} alt={product.name} fill sizes="(max-width:768px) 50vw, 25vw" className={classes.productImage} />
        </div>
        {product.badge && (
          <span className={`${classes.productBadge} ${classes[`badge${product.badge}`]}`}>{product.badge}</span>
        )}
        <div className={classes.productOverlay}>
          <Link href={`/products/${product.slug || product.id}`} className={classes.quickViewBtn}>Quick View</Link>
        </div>
        <button
          className={[classes.wishlistBtn, wishlisted && classes.wishlistBtnActive].filter(Boolean).join(' ')}
          onClick={() => setWishlisted(v => !v)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? <HeartFilledIcon size={16} color="hsl(350,70%,55%)" /> : <HeartIcon size={16} />}
        </button>
      </div>
      <div className={classes.productInfo}>
        <p className={classes.productCategory}>{product.category}</p>
        <h3 className={classes.productName}>
          <Link href={`/products/${product.slug || product.id}`}>
            {product.name}
          </Link>
        </h3>
        <div className={classes.productMeta}>
          <StarRating rating={product.rating} />
          <span className={classes.productReviews}>({product.reviews})</span>
        </div>
        <div className={classes.productPricing}>
          <span className={classes.productPrice}>₹{product.price.toLocaleString('en-IN')}</span>
          <span className={classes.productOriginal}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
          <span className={classes.productDiscount}>{discount}% off</span>
        </div>
        {inCart ? (
          <Link href="/cart" className={`${classes.addToCartBtn} ${classes.inCartBtn}`}>
            ✓ In Bag — View Cart
          </Link>
        ) : (
          <button type="button" onClick={handleAddToCart} className={classes.addToCartBtn}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const slide = heroSlides[activeSlide]

  useEffect(() => {
    const id = setInterval(() => setActiveSlide(s => (s + 1) % heroSlides.length), 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={classes.homePage}>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className={classes.hero}>
        {/* Background image with overlay */}
        <div className={classes.heroBg}>
          <Image
            key={slide.id}
            src={slide.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className={classes.heroBgImage}
          />
          <div className={classes.heroBgOverlay} style={{ background: slide.overlay }} />
        </div>

        <div className={classes.heroContent}>
          <div className={classes.heroText}>
            <span className={classes.heroTag}>{slide.tag}</span>
            <h1 className={classes.heroTitle}>
              {slide.title.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
              ))}
            </h1>
            <p className={classes.heroSubtitle}>{slide.subtitle}</p>
            <div className={classes.heroCtas}>
              <Link href={slide.cta.href} className={classes.heroPrimary}>
                {slide.cta.label}
                <ArrowRightIcon size={16} />
              </Link>
              <Link href={slide.secondaryCta.href} className={classes.heroSecondary}>
                {slide.secondaryCta.label}
              </Link>
            </div>
            <div className={classes.heroTrust}>
              <span><CheckIcon size={13} /> Free Shipping</span>
              <span><CheckIcon size={13} /> COD Available</span>
              <span><CheckIcon size={13} /> Easy Returns</span>
            </div>
          </div>

          {/* Slide counter */}
          <div className={classes.heroSlideCounter}>
            <span className={classes.heroSlideActive}>{String(activeSlide + 1).padStart(2, '0')}</span>
            <span className={classes.heroSlideSep}>/</span>
            <span>{String(heroSlides.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          className={`${classes.heroNav} ${classes.heroNavPrev}`}
          onClick={() => setActiveSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}
          aria-label="Previous slide"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <button
          className={`${classes.heroNav} ${classes.heroNavNext}`}
          onClick={() => setActiveSlide(s => (s + 1) % heroSlides.length)}
          aria-label="Next slide"
        >
          <ChevronRightIcon size={20} />
        </button>

        {/* Dot indicators */}
        <div className={classes.heroDots}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={[classes.heroDot, i === activeSlide && classes.heroDotActive].filter(Boolean).join(' ')}
              onClick={() => setActiveSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className={classes.heroScroll}>
          <span className={classes.heroScrollLabel}>Scroll</span>
          <div className={classes.heroScrollTrack}>
            <div className={classes.heroScrollThumb} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PERKS BAR
      ══════════════════════════════════════════════════ */}
      <section className={classes.perksBar}>
        {perks.map(({ Icon, title, desc }) => (
          <div key={title} className={classes.perk}>
            <div className={classes.perkIconWrap}><Icon size={22} /></div>
            <div>
              <p className={classes.perkTitle}>{title}</p>
              <p className={classes.perkDesc}>{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════ */}
      <section className={classes.categoriesSection}>
        <div className={classes.container}>
          <div className={classes.sectionHeader}>
            <p className={classes.sectionLabel}>Shop by Category</p>
            <h2 className={classes.sectionTitle}>Find Your Style</h2>
            <p className={classes.sectionSubtitle}>Explore our curated collections of premium Indian ethnic wear</p>
          </div>
          <div className={classes.categoriesGrid}>
            {categories.map(cat => (
              <Link key={cat.label} href={cat.href} className={classes.categoryCard}>
                <div className={classes.categoryImageWrap}>
                  <Image src={cat.image} alt={cat.label} fill sizes="(max-width:768px) 50vw, 18vw" className={classes.categoryImage} />
                  <div className={classes.categoryOverlay} />
                </div>
                <div className={classes.categoryContent}>
                  <div className={classes.categoryIconWrap}>
                    <cat.Icon size={22} color="currentColor" />
                  </div>
                  <div>
                    <h3 className={classes.categoryName}>{cat.label}</h3>
                    <p className={classes.categoryDesc}>{cat.description}</p>
                  </div>
                  <ChevronRightIcon size={16} className={classes.categoryArrow} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════ */}
      <section className={classes.productsSection}>
        <div className={classes.container}>
          <div className={classes.sectionHeader}>
            <p className={classes.sectionLabel}>Handpicked for You</p>
            <h2 className={classes.sectionTitle}>Featured Picks</h2>
            <p className={classes.sectionSubtitle}>Our most-loved pieces — crafted with care, priced with love</p>
          </div>
          <div className={classes.productsGrid}>
            {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
          <div className={classes.sectionCta}>
            <Link href="/products" className={classes.viewAllBtn}>
              View All Products <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FLASH SALE BANNER
      ══════════════════════════════════════════════════ */}
      <section className={classes.offerSection}>
        <div className={classes.container}>
          <div className={classes.offerInner}>
            <div className={classes.offerLeft}>
              <div className={classes.offerTagWrap}>
                <ZapIcon size={14} />
                <span>Flash Sale</span>
              </div>
              <h2 className={classes.offerTitle}>Festive Season Special</h2>
              <p className={classes.offerSubtitle}>
                Up to 40% off on selected ethnic wear. Use code{' '}
                <span className={classes.couponCode}>AARKALI40</span>
              </p>
              <CountdownTimer />
              <Link href="/products?sale=true" className={classes.offerBtn}>
                Shop the Sale <ArrowRightIcon size={16} />
              </Link>
            </div>
            <div className={classes.offerRight}>
              <div className={classes.offerImageCard}>
                <Image
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=480&q=85&auto=format&fit=crop"
                  alt="Festive Collection"
                  fill
                  sizes="480px"
                  className={classes.offerImage}
                />
                <div className={classes.offerBadge}>
                  <span className={classes.offerBadgeNum}>40</span>
                  <span className={classes.offerBadgeText}>% OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════════════════ */}
      <section className={classes.newArrivalsSection}>
        <div className={classes.container}>
          <div className={classes.sectionHeader}>
            <p className={classes.sectionLabel}>Fresh from the Studio</p>
            <h2 className={classes.sectionTitle}>New Arrivals</h2>
          </div>
          <div className={classes.newArrivalsGrid}>
            {newArrivals.map(item => (
              <Link key={item.id} href={`/products?sort=newest`} className={classes.newArrivalCard}>
                <div className={classes.newArrivalImageWrap}>
                  <Image src={item.image} alt={item.name} fill sizes="(max-width:768px) 50vw, 17vw" className={classes.newArrivalImage} />
                  <div className={classes.newArrivalOverlay} />
                  <div className={classes.newArrivalContent}>
                    <span className={classes.newArrivalBadge}>New</span>
                    <h3 className={classes.newArrivalName}>{item.name}</h3>
                    <p className={classes.newArrivalCat}>{item.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section className={classes.testimonialsSection}>
        <div className={classes.container}>
          <div className={classes.sectionHeader}>
            <p className={classes.sectionLabel}>Customer Love</p>
            <h2 className={classes.sectionTitle}>What Our Customers Say</h2>
          </div>
        </div>
        <div className={classes.marqueeWrapper}>
          <div className={classes.marqueeTrack}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className={classes.testimonialCard}>
                <div className={classes.testimonialHeader}>
                  <div className={classes.testimonialAvatar}>{t.initials}</div>
                  <div>
                    <p className={classes.testimonialName}>{t.name}</p>
                    <p className={classes.testimonialCity}>{t.city}</p>
                  </div>
                  <StarRating rating={t.rating} />
                </div>
                <p className={classes.testimonialText}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════════ */}
      <section className={classes.whySection}>
        <div className={classes.container}>
          <div className={classes.sectionHeader}>
            <p className={classes.sectionLabel}>Our Promise</p>
            <h2 className={classes.sectionTitle}>Why Choose Aarkali?</h2>
          </div>
          <div className={classes.whyGrid}>
            {whyUs.map(({ Icon, title, desc }) => (
              <div key={title} className={classes.whyCard}>
                <div className={classes.whyIconWrap}><Icon size={24} /></div>
                <h3 className={classes.whyTitle}>{title}</h3>
                <p className={classes.whyDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════ */}
      <section className={classes.newsletterSection}>
        <div className={classes.newsletterBg}>
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=75&auto=format&fit=crop"
            alt=""
            fill
            sizes="100vw"
            className={classes.newsletterBgImage}
          />
          <div className={classes.newsletterBgOverlay} />
        </div>
        <div className={classes.container}>
          <div className={classes.newsletterInner}>
            <p className={classes.sectionLabel} style={{ color: 'var(--boutique-gold-300)' }}>Stay Connected</p>
            <h2 className={classes.newsletterTitle}>Join the Aarkali Family</h2>
            <p className={classes.newsletterSubtitle}>
              Subscribe for exclusive offers, new collection alerts, and style inspiration delivered to your inbox.
            </p>
            <form className={classes.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" className={classes.newsletterInput} required />
              <button type="submit" className={classes.newsletterBtn}>Subscribe</button>
            </form>
            <p className={classes.newsletterNote}>
              <ShieldIcon size={13} /> No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
