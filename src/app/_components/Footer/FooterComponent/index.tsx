'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { noHeaderFooterUrls, STORE_NAME, STORE_PHONE, STORE_EMAIL } from '../../../constants'
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  InstagramIcon,
  FacebookIcon,
  PinterestIcon,
  YoutubeIcon,
  WhatsAppIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldIcon,
} from '../../Icons'

import classes from './index.module.scss'

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Sarees', href: '/products?category=sarees' },
    { label: 'Kurtis', href: '/products?category=kurtis' },
    { label: 'Lehengas', href: '/products?category=lehengas' },
    { label: 'Jewellery', href: '/products?category=accessories' },
    { label: 'Dupattas', href: '/products?category=dupattas' },
    { label: 'Salwar Sets', href: '/products?category=salwar-sets' },
  ],
  'Customer Care': [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQ', href: '/faq' },
  ],
  'About Us': [
    { label: 'Our Story', href: '/about' },
    { label: 'Artisan Partners', href: '/artisans' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Pinterest', href: 'https://pinterest.com', Icon: PinterestIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon },
  { label: 'WhatsApp', href: 'https://wa.me/919876543210', Icon: WhatsAppIcon },
]

const paymentMethods = ['Razorpay', 'UPI', 'Net Banking', 'Visa', 'Mastercard', 'Cash on Delivery']

function FooterComponent() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  if (noHeaderFooterUrls.includes(pathname)) return null

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className={classes.footer}>
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className={classes.footerTop}>
        <div className={classes.footerTopInner}>
          <div className={classes.brandCol}>
            <Link href="/" className={classes.footerLogo}>
              <span className={classes.footerLogoIcon}>𝒜</span>
              <span className={classes.footerLogoText}>{STORE_NAME}</span>
            </Link>
            <p className={classes.footerTagline}>
              Celebrating the heritage and craftsmanship of Indian ethnic fashion. Every piece is handcrafted with precision, authenticity, and grace.
            </p>
            <div className={classes.footerContact}>
              <a href="tel:+919876543210" className={classes.contactItem}>
                <PhoneIcon size={15} /> {STORE_PHONE}
              </a>
              <a href={`mailto:${STORE_EMAIL}`} className={classes.contactItem}>
                <MailIcon size={15} /> {STORE_EMAIL}
              </a>
              <p className={classes.contactItem}>
                <MapPinIcon size={15} /> Tamil Nadu, India
              </p>
            </div>
            <div className={classes.footerSocials}>
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIcon}
                  aria-label={label}
                  title={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className={classes.linkCol}>
              <h3 className={classes.colHeading}>{heading}</h3>
              <ul className={classes.linkList}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className={classes.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={classes.newsletterCol}>
            <h3 className={classes.colHeading}>Stay in the Loop</h3>
            <p className={classes.newsletterText}>
              Receive exclusive offers, new arrival previews, and styling guides directly to your inbox.
            </p>
            {subscribed ? (
              <div className={classes.subscribedMsg}>
                <CheckCircleIcon size={18} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={classes.newsletterForm}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className={classes.newsletterInput}
                />
                <button type="submit" className={classes.newsletterBtn}>
                  Subscribe <ArrowRightIcon size={15} />
                </button>
              </form>
            )}
            <div className={classes.paymentSection}>
              <p className={classes.paymentLabel}>
                <ShieldIcon size={12} /> 100% Secure Checkout
              </p>
              <div className={classes.paymentBadges}>
                {paymentMethods.map(m => (
                  <span key={m} className={classes.paymentBadge}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <div className={classes.footerBottom}>
        <div className={classes.footerBottomInner}>
          <p className={classes.copyright}>
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
          <div className={classes.policies}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
            <Link href="/return-policy">Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent
