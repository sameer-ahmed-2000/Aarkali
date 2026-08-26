export const inclusions = [
  {
    title: 'Free Shipping',
    description: 'Free delivery on orders above ₹999 across India',
    key: 'shipping',
  },
  {
    title: 'Easy Returns',
    description: '7-day hassle-free returns and exchanges',
    key: 'returns',
  },
  {
    title: 'Cash on Delivery',
    description: 'Pay comfortably when your order arrives',
    key: 'cod',
  },
  {
    title: 'Dedicated Support',
    description: 'Call or WhatsApp our styling experts',
    key: 'support',
  },
]

export const profileNavItems = [
  {
    title: 'My Profile',
    url: '/account',
    key: 'profile',
  },
  {
    title: 'My Orders',
    url: '/orders',
    key: 'orders',
  },
  {
    title: 'My Wishlist',
    url: '/wishlist',
    key: 'wishlist',
  },
  {
    title: 'Track Order',
    url: '/track-order',
    key: 'track',
  },
  {
    title: 'Logout',
    url: '/logout',
    key: 'logout',
  },
]

export const mainNavItems = [
  { label: 'All', href: '/products' },
  { label: 'Sarees', href: '/products?category=sarees' },
  { label: 'Kurtis', href: '/products?category=kurtis' },
  { label: 'Lehengas', href: '/products?category=lehengas' },
  { label: 'Jewellery', href: '/products?category=accessories' },
  { label: 'Dupattas', href: '/products?category=dupattas' },
  { label: 'Suits', href: '/products?category=salwar-sets' },
  { label: 'Sale', href: '/products?sale=true', highlight: true },
]

export const noHeaderFooterUrls = ['/create-account', '/login', '/recover-password']

export const CURRENCY = '₹'
export const CURRENCY_CODE = 'INR'
export const STORE_NAME = 'Aarkali Boutique'
export const STORE_PHONE = '+91 98765 43210'
export const STORE_EMAIL = 'support@aarkali.com'
export const STORE_WEBSITE = 'www.aarkali.com'
export const FREE_SHIPPING_THRESHOLD = 999
export const COD_AVAILABLE = true
