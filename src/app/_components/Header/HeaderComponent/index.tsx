'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Header } from '../../../../payload/payload-types'
import { noHeaderFooterUrls, mainNavItems, STORE_NAME, STORE_PHONE, STORE_EMAIL } from '../../../constants'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import { useWishlist } from '../../../_providers/Wishlist'
import {
  SearchIcon,
  CartIcon,
  HeartIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  PackageIcon,
  XIcon,
} from '../../Icons'

import classes from './index.module.scss'

const HeaderComponent = ({ header }: { header: Header }) => {
  const pathname = usePathname()
  const { user } = useAuth()
  const { cart } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const cartCount = cart?.items?.reduce((acc, item) => acc + (typeof item?.quantity === 'number' ? item.quantity : 1), 0) || 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [pathname])

  if (noHeaderFooterUrls.includes(pathname)) return null

  return (
    <>
      {/* ── Announcement Bar ─────────────────────────────────────── */}
      <div className={classes.announcementBar}>
        <div className={classes.announcementInner}>
          <span>Free express shipping on orders above ₹999 &nbsp;·&nbsp; Cash on Delivery available across India</span>
          <span className={classes.announcementContact}>
            <PhoneIcon size={13} />
            <a href="tel:+919876543210">{STORE_PHONE}</a>
          </span>
        </div>
      </div>

      {/* ── Main Header ──────────────────────────────────────────── */}
      <header
        className={[
          classes.header,
          scrolled && classes.scrolled,
          mobileOpen && classes.mobileOpen,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.inner}>
          {/* Logo */}
          <Link href="/" className={classes.logo} aria-label="Aarkali Boutique Home">
            <span className={classes.logoIcon}>𝒜</span>
            <span className={classes.logoText}>{STORE_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={classes.desktopNav} aria-label="Main navigation">
            {mainNavItems.map(item => (
              <div key={item.label} className={classes.navItem}>
                <Link
                  href={item.href}
                  className={[
                    classes.navLink,
                    item.highlight && classes.navLinkHighlight,
                    pathname.includes(item.href.split('?')[0]) && classes.navLinkActive,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className={classes.actions}>
            {/* Search */}
            <button
              className={classes.iconBtn}
              onClick={() => setSearchOpen(v => !v)}
              aria-label="Search products"
            >
              <SearchIcon size={19} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className={classes.iconBtn} aria-label={`Wishlist (${wishlistCount} items)`}>
              <HeartIcon size={19} />
              {wishlistCount > 0 && (
                <span className={classes.cartBadge}>
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className={classes.iconBtn} aria-label={`Shopping Cart (${cartCount} items)`} title="Shopping Bag">
              <CartIcon size={19} />
              {cartCount > 0 && (
                <span className={classes.cartBadge} key={cartCount}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {user ? (
              <Link href="/account" className={classes.accountBtn} aria-label="My Account">
                <span className={classes.avatarCircle}>
                  {user.name?.[0]?.toUpperCase() || 'A'}
                </span>
              </Link>
            ) : (
              <Link href="/login" className={classes.loginBtn}>
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className={[classes.hamburger, mobileOpen && classes.hamburgerOpen]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* ── Search Bar ─────────────────────────────────────────── */}
        <div className={[classes.searchBar, searchOpen && classes.searchBarOpen].filter(Boolean).join(' ')}>
          <div className={classes.searchInner}>
            <SearchIcon size={18} color="var(--theme-text-muted)" />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sarees, kurtis, lehengas, jewellery..."
              className={classes.searchInput}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
                }
                if (e.key === 'Escape') setSearchOpen(false)
              }}
            />
            <button className={classes.searchClose} onClick={() => setSearchOpen(false)} aria-label="Close search">
              <XIcon size={18} />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────────────── */}
        <div
          className={[classes.mobileMenu, mobileOpen && classes.mobileMenuOpen]
            .filter(Boolean)
            .join(' ')}
          aria-hidden={!mobileOpen}
        >
          <nav>
            {mainNavItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={[classes.mobileNavLink, item.highlight && classes.mobileNavLinkHighlight]
                  .filter(Boolean)
                  .join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={classes.mobileDivider} />
          <div className={classes.mobileActions}>
            {user ? (
              <>
                <Link href="/account" className={classes.mobileActionLink}>
                  <UserIcon size={18} /> My Account
                </Link>
                <Link href="/orders" className={classes.mobileActionLink}>
                  <PackageIcon size={18} /> My Orders
                </Link>
                <Link href="/cart" className={classes.mobileActionLink}>
                  <CartIcon size={18} /> My Shopping Bag ({cartCount})
                </Link>
                <Link href="/wishlist" className={classes.mobileActionLink}>
                  <HeartIcon size={18} /> Wishlist ({wishlistCount})
                </Link>
                <Link href="/track-order" className={classes.mobileActionLink}>
                  <SearchIcon size={18} /> Track Order
                </Link>
                <Link href="/logout" className={classes.mobileActionLink}>
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className={classes.mobileLoginBtn}>Login</Link>
                <Link href="/create-account" className={classes.mobileRegisterBtn}>Create Account</Link>
              </>
            )}
          </div>
          <div className={classes.mobileContact}>
            <p>
              <PhoneIcon size={14} />
              <a href="tel:+919876543210">{STORE_PHONE}</a>
            </p>
            <p>
              <MailIcon size={14} />
              <a href={`mailto:${STORE_EMAIL}`}>{STORE_EMAIL}</a>
            </p>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ──────────────────────────────────────── */}
      {mobileOpen && (
        <div className={classes.overlay} onClick={() => setMobileOpen(false)} aria-hidden />
      )}
    </>
  )
}

export default HeaderComponent
