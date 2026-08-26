import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRightIcon,
  LogoutIcon,
  ChevronLeftIcon,
} from '../../../app/_components/Icons'
import './index.scss'

export const AdminHeader: React.FC = () => {
  const location = useLocation()
  const path = location.pathname.toLowerCase()
  const isDashboard = path === '/admin' || path === '/admin/'

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('adminTheme') as 'dark' | 'light') || 'dark'
    }
    return 'dark'
  })

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminTheme', nextTheme)
      document.documentElement.setAttribute('data-admin-theme', nextTheme)
      window.dispatchEvent(new CustomEvent('admin-theme-changed', { detail: nextTheme }))
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-admin-theme', theme)
    }

    const handleThemeChange = (e: Event) => {
      const customEvt = e as CustomEvent
      if (customEvt.detail) {
        setTheme(customEvt.detail)
      }
    }

    window.addEventListener('admin-theme-changed', handleThemeChange)
    return () => window.removeEventListener('admin-theme-changed', handleThemeChange)
  }, [theme])

  // All 13 Workflow Breadcrumb Path Mappings
  const getBreadcrumbTitle = (): string => {
    if (path.includes('/products')) return 'Dashboard › Product Management'
    if (path.includes('/categories')) return 'Dashboard › Category Management'
    if (path.includes('/orders')) return 'Dashboard › Order Management'
    if (path.includes('/coupons')) return 'Dashboard › Offers & Coupons'
    if (path.includes('/banners')) return 'Dashboard › Banner & Content'
    if (path.includes('/notifications')) return 'Dashboard › Push Alert Management'
    if (path.includes('/users')) return 'Dashboard › Customer & Staff Management'
    if (path.includes('/media')) return 'Dashboard › Media Asset Gallery'
    if (path.includes('/pages')) return 'Dashboard › Custom Pages Management'
    if (path.includes('/reviews')) return 'Dashboard › Customer Reviews & Moderation'
    if (path.includes('/globals/settings')) return 'Dashboard › Executive Store Settings'
    if (path.includes('/globals/header')) return 'Dashboard › Header Navigation Config'
    if (path.includes('/globals/footer')) return 'Dashboard › Footer Configuration'
    return 'Dashboard › Management Portal'
  }

  return (
    <div className="admin-header-wrapper">
      {/* ── Top Announcement & Live Store Navigation Bar ───────────────────── */}
      <div className="admin-header__announcement-bar">
        <div className="admin-header__announcement-inner">
          <span className="admin-header__announcement-title">
            ✨ Aarkali Boutique — Executive Admin Management Portal
          </span>
          <div className="admin-header__announcement-right">
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-header__visit-store-link">
              Visit Live Storefront <ArrowRightIcon size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Command Center Header Bar ──────────────────────────────────── */}
      <header className="admin-header__bar">
        <div className="admin-header__inner">
          {/* Logo & Title Link */}
          <Link to="/admin" className="admin-header__brand-logo" title="Go to Admin Dashboard">
            <span className="admin-header__logo-icon">𝒜</span>
            <div className="admin-header__logo-text-wrap">
              <span className="admin-header__logo-title">Aarkali Boutique</span>
              <span className="admin-header__logo-sub">Executive Command Center</span>
            </div>
          </Link>

          {/* Breadcrumb Navigation on Subpages */}
          {!isDashboard && (
            <div className="admin-header__breadcrumbs-wrap">
              <Link to="/admin" className="admin-header__back-btn">
                <ChevronLeftIcon size={16} /> Back to Dashboard
              </Link>
              <span className="admin-header__breadcrumb-path">
                {getBreadcrumbTitle()}
              </span>
            </div>
          )}

          {/* Header Controls & Actions */}
          <div className="admin-header__actions">
            {/* Interactive Theme Switcher Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`admin-header__theme-toggle-btn admin-header__theme-toggle-btn--${theme}`}
              title={`Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Luxury Mode'}`}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Luxury'}
            </button>

            <div className="admin-header__system-status">
              <span className="admin-header__status-dot" />
              System Online
            </div>

            <div className="admin-header__admin-badge">
              <span className="admin-header__avatar-circle">A</span>
              <span className="admin-header__admin-name">Administrator</span>
            </div>

            <a href="/admin/logout" className="admin-header__logout-btn" title="Logout from Admin Panel">
              <LogoutIcon size={16} /> Logout
            </a>
          </div>
        </div>
      </header>
    </div>
  )
}

export default AdminHeader
