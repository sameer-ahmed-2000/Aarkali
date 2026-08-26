import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  SareeIcon,
  KurtiIcon,
  PackageIcon,
  RefreshIcon,
  UsersIcon,
  TagIcon,
  SparkleIcon,
  ZapIcon,
  JewelleryIcon,
  TruckIcon,
  ShieldIcon,
  SearchIcon,
  CheckCircleIcon,
  FilterIcon,
} from '../../../app/_components/Icons'
import './index.scss'

const baseClass = 'before-dashboard'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  pendingOrdersCount: number
  totalCustomers: number
  totalProducts: number
  lowStockCount: number
  lowStockProducts: Array<{ id: string; title: string; sku: string; stock: number; threshold: number }>
  activeCoupons: number
  activeBanners: number
  deliveryBreakdown: {
    sameDay: number
    scheduled: number
    standard: number
  }
}

const BeforeDashboard: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('adminTheme') as 'dark' | 'light') || 'dark'
    }
    return 'dark'
  })

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

  useEffect(() => {
    fetch('/api/admin/analytics', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (json && json.data) {
          setStats(json.data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // All 13 Admin Workflows with exact target routes and icons
  const modules = [
    {
      id: 'products',
      title: 'Product Management',
      path: '/admin/collections/products',
      icon: <SareeIcon size={24} />,
      desc: 'Catalog items, SKU, pricing & stock thresholds',
      tag: 'Catalog',
    },
    {
      id: 'categories',
      title: 'Category Management',
      path: '/admin/collections/categories',
      icon: <KurtiIcon size={24} />,
      desc: 'Boutique collections, display order & slugs',
      tag: 'Catalog',
    },
    {
      id: 'orders',
      title: 'Order Management',
      path: '/admin/collections/orders',
      icon: <PackageIcon size={24} />,
      desc: 'Order processing, packing status & fulfillment',
      tag: 'Fulfillment',
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      path: '/admin/collections/products',
      icon: <RefreshIcon size={24} />,
      desc: 'Reorder points, stock counts & low stock alerts',
      tag: 'Inventory',
    },
    {
      id: 'customers',
      title: 'Customer Management',
      path: '/admin/collections/users',
      icon: <UsersIcon size={24} />,
      desc: 'Profiles, phone numbers & saved address books',
      tag: 'Customers',
    },
    {
      id: 'coupons',
      title: 'Offers & Coupons',
      path: '/admin/collections/coupons',
      icon: <TagIcon size={24} />,
      desc: 'Promotional discount codes & usage caps',
      tag: 'Marketing',
    },
    {
      id: 'banners',
      title: 'Banner & Content',
      path: '/admin/collections/banners',
      icon: <SparkleIcon size={24} />,
      desc: 'Hero sliders, popups & top announcements',
      tag: 'Content',
    },
    {
      id: 'analytics',
      title: 'Reports & Analytics',
      path: '/admin/collections/orders',
      icon: <ZapIcon size={24} />,
      desc: 'Gross revenue, sales metrics & breakdown',
      tag: 'Reports',
    },
    {
      id: 'notifications',
      title: 'Notification Alerts',
      path: '/admin/collections/notifications',
      icon: <JewelleryIcon size={24} />,
      desc: 'Customer push alerts & system notifications',
      tag: 'Alerts',
    },
    {
      id: 'media',
      title: 'Media Asset Gallery',
      path: '/admin/collections/media',
      icon: <SparkleIcon size={24} />,
      desc: 'Product imagery, banner graphics & upload library',
      tag: 'Media',
    },
    {
      id: 'pages',
      title: 'Custom Pages',
      path: '/admin/collections/pages',
      icon: <SareeIcon size={24} />,
      desc: 'Storefront CMS pages, privacy policy & terms',
      tag: 'CMS',
    },
    {
      id: 'reviews',
      title: 'Customer Reviews',
      path: '/admin/collections/reviews',
      icon: <TagIcon size={24} />,
      desc: 'Product ratings, customer reviews & moderation',
      tag: 'Social',
    },
    {
      id: 'settings',
      title: 'Executive Store Settings',
      path: '/admin/globals/settings',
      icon: <FilterIcon size={24} />,
      desc: 'Global store config, brand info & social links',
      tag: 'Config',
    },
  ]

  const filteredModules = modules.filter(
    m =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tag.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`${baseClass} ${baseClass}--${theme}`}>
      {/* ── Search Filter & Quick Creation Actions Bar ─────────────────────── */}
      <div className={`${baseClass}__filter-bar`}>
        <div className={`${baseClass}__quick-actions`}>
          <span className={`${baseClass}__quick-actions-label`}>⚡ Quick Actions:</span>
          <div className={`${baseClass}__quick-actions-btns`}>
            <Link to="/admin/collections/products/create" className={`${baseClass}__quick-btn`}>
              + Add Product
            </Link>
            <Link to="/admin/collections/categories/create" className={`${baseClass}__quick-btn`}>
              + Add Category
            </Link>
            <Link to="/admin/collections/coupons/create" className={`${baseClass}__quick-btn`}>
              + Create Coupon
            </Link>
            <Link to="/admin/collections/banners/create" className={`${baseClass}__quick-btn`}>
              + Add Banner
            </Link>
            <Link to="/admin/collections/notifications/create" className={`${baseClass}__quick-btn`}>
              + Push Alert
            </Link>
          </div>
        </div>

        <div className={`${baseClass}__header-search`}>
          <SearchIcon size={16} />
          <input
            type="text"
            placeholder="Search workflows, orders, products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`${baseClass}__search-input`}
          />
        </div>
      </div>

      {/* ── KPI Analytics Metrics Grid ────────────────────────────────────────── */}
      <div className={`${baseClass}__metrics-grid`}>
        <div className={`${baseClass}__metric-card`}>
          <div className={`${baseClass}__metric-icon`}><ZapIcon size={22} /></div>
          <div className={`${baseClass}__metric-info`}>
            <span className={`${baseClass}__metric-label`}>Total Revenue</span>
            <h3 className={`${baseClass}__metric-value`}>
              {loading ? '...' : `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
            </h3>
            <span className={`${baseClass}__metric-sub`}>Gross store sales</span>
          </div>
        </div>

        <div className={`${baseClass}__metric-card`}>
          <div className={`${baseClass}__metric-icon`}><PackageIcon size={22} /></div>
          <div className={`${baseClass}__metric-info`}>
            <span className={`${baseClass}__metric-label`}>Total Orders</span>
            <h3 className={`${baseClass}__metric-value`}>
              {loading ? '...' : stats?.totalOrders || 0}
            </h3>
            <span className={`${baseClass}__metric-sub`}>
              {stats?.pendingOrdersCount || 0} Pending dispatch
            </span>
          </div>
        </div>

        <div className={`${baseClass}__metric-card`}>
          <div className={`${baseClass}__metric-icon`}><UsersIcon size={22} /></div>
          <div className={`${baseClass}__metric-info`}>
            <span className={`${baseClass}__metric-label`}>Active Customers</span>
            <h3 className={`${baseClass}__metric-value`}>
              {loading ? '...' : stats?.totalCustomers || 0}
            </h3>
            <span className={`${baseClass}__metric-sub`}>Registered users</span>
          </div>
        </div>

        <div className={`${baseClass}__metric-card ${(stats?.lowStockCount || 0) > 0 ? `${baseClass}__metric-card--alert` : ''}`}>
          <div className={`${baseClass}__metric-icon`}><RefreshIcon size={22} /></div>
          <div className={`${baseClass}__metric-info`}>
            <span className={`${baseClass}__metric-label`}>Low Stock Alerts</span>
            <h3 className={`${baseClass}__metric-value`}>
              {loading ? '...' : stats?.lowStockCount || 0}
            </h3>
            <span className={`${baseClass}__metric-sub`}>Items requiring restock</span>
          </div>
        </div>

        <div className={`${baseClass}__metric-card`}>
          <div className={`${baseClass}__metric-icon`}><TagIcon size={22} /></div>
          <div className={`${baseClass}__metric-info`}>
            <span className={`${baseClass}__metric-label`}>Active Offers</span>
            <h3 className={`${baseClass}__metric-value`}>
              {loading ? '...' : stats?.activeCoupons || 0}
            </h3>
            <span className={`${baseClass}__metric-sub`}>Live coupon codes</span>
          </div>
        </div>

        <div className={`${baseClass}__metric-card`}>
          <div className={`${baseClass}__metric-icon`}><TruckIcon size={22} /></div>
          <div className={`${baseClass}__metric-info`}>
            <span className={`${baseClass}__metric-label`}>Express Deliveries</span>
            <h3 className={`${baseClass}__metric-value`}>
              {loading ? '...' : stats?.deliveryBreakdown?.sameDay || 0}
            </h3>
            <span className={`${baseClass}__metric-sub`}>Same-day orders</span>
          </div>
        </div>
      </div>

      {/* ── 13 Required Admin Workflow Modules Grid ────────────────────────────── */}
      <div className={`${baseClass}__section`}>
        <div className={`${baseClass}__section-header`}>
          <h3 className={`${baseClass}__section-title`}>Admin Management Workflows</h3>
          <span className={`${baseClass}__module-count`}>{filteredModules.length} Modules Active</span>
        </div>

        <div className={`${baseClass}__modules-grid`}>
          {filteredModules.map(item => (
            <Link key={item.id} to={item.path} className={`${baseClass}__module-card`}>
              <div className={`${baseClass}__module-card-top`}>
                <div className={`${baseClass}__module-icon`}>{item.icon}</div>
                <span className={`${baseClass}__module-tag`}>{item.tag}</span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Dual Panel Layout (Delivery Dispatch & Inventory Warnings) ───────── */}
      <div className={`${baseClass}__dual-panel`}>
        {/* Delivery Dispatch Integration */}
        <div className={`${baseClass}__panel`}>
          <h4>Delivery Dispatch Integration</h4>
          <div className={`${baseClass}__delivery-channels`}>
            <div className={`${baseClass}__channel-item`}>
              <span className={`${baseClass}__channel-badge ${baseClass}__channel-badge--sameday`}>Same-Day Delivery</span>
              <span className={`${baseClass}__channel-count`}>{stats?.deliveryBreakdown?.sameDay || 0} Active Orders</span>
            </div>
            <div className={`${baseClass}__channel-item`}>
              <span className={`${baseClass}__channel-badge ${baseClass}__channel-badge--scheduled`}>Scheduled Slots</span>
              <span className={`${baseClass}__channel-count`}>{stats?.deliveryBreakdown?.scheduled || 0} Active Orders</span>
            </div>
            <div className={`${baseClass}__channel-item`}>
              <span className={`${baseClass}__channel-badge ${baseClass}__channel-badge--standard`}>Standard Shipping</span>
              <span className={`${baseClass}__channel-count`}>{stats?.deliveryBreakdown?.standard || 0} Active Orders</span>
            </div>
          </div>
        </div>

        {/* Low Stock Warning Panel */}
        <div className={`${baseClass}__panel`}>
          <h4>Inventory Reorder Warnings</h4>
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <ul className={`${baseClass}__stock-list`}>
              {stats.lowStockProducts.map(item => (
                <li key={item.id} className={`${baseClass}__stock-item`}>
                  <div className={`${baseClass}__stock-info`}>
                    <strong>{item.title}</strong>
                    <span>SKU: {item.sku}</span>
                  </div>
                  <span className={`${baseClass}__stock-badge`}>
                    {item.stock} in stock (Threshold: {item.threshold})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${baseClass}__clean-stock`}>
              <CheckCircleIcon size={18} /> All inventory stock levels are healthy.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BeforeDashboard
