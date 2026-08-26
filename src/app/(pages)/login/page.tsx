import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { RenderParams } from '../../_components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import LoginForm from './LoginForm'
import {
  GiftIcon,
  PackageIcon,
  HeartIcon,
  RefreshIcon,
  ShieldIcon,
  ArrowRightIcon,
} from '../../_components/Icons'

import classes from './index.module.scss'

export default async function Login() {
  await getMeUser({
    validUserRedirect: `/account?warning=${encodeURIComponent('You are already logged in.')}`,
  })

  return (
    <div className={classes.authPage}>
      {/* Left decorative panel */}
      <div className={classes.leftPanel}>
        <div className={classes.leftContent}>
          <Link href="/" className={classes.leftLogo}>
            <span className={classes.leftLogoIcon}>𝒜</span>
            <span className={classes.leftLogoText}>Aarkali Boutique</span>
          </Link>

          <div className={classes.leftFeatures}>
            <div className={classes.feature}>
              <div className={classes.featureIconWrap}>
                <GiftIcon size={20} />
              </div>
              <div>
                <h3>Exclusive Collections</h3>
                <p>Access member-only pricing and seasonal launches</p>
              </div>
            </div>

            <div className={classes.feature}>
              <div className={classes.featureIconWrap}>
                <PackageIcon size={20} />
              </div>
              <div>
                <h3>Real-time Order Tracking</h3>
                <p>Track your shipment from atelier to doorstep</p>
              </div>
            </div>

            <div className={classes.feature}>
              <div className={classes.featureIconWrap}>
                <HeartIcon size={20} />
              </div>
              <div>
                <h3>Curated Wishlist</h3>
                <p>Save and organize your favourite ethnic outfits</p>
              </div>
            </div>

            <div className={classes.feature}>
              <div className={classes.featureIconWrap}>
                <RefreshIcon size={20} />
              </div>
              <div>
                <h3>Effortless Returns</h3>
                <p>Enjoy our 7-day hassle-free exchange policy</p>
              </div>
            </div>
          </div>

          <div className={classes.leftTrustBadge}>
            <ShieldIcon size={16} />
            <span>100% Authentic Indian Craftsmanship</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={classes.rightPanel}>
        <div className={classes.formContainer}>
          <RenderParams />

          <div className={classes.formHeader}>
            <h1 className={classes.formTitle}>Welcome Back</h1>
            <p className={classes.formSubtitle}>Sign in to your Aarkali account</p>
          </div>

          <LoginForm />

          <div className={classes.formFooter}>
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/create-account" className={classes.authLink}>
                Create Account
              </Link>
            </p>
            <Link href="/recover-password" className={classes.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <div className={classes.backLink}>
            <Link href="/">&larr; Back to Boutique Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Login | Aarkali Boutique',
  description: 'Sign in to your Aarkali Boutique account to access orders, wishlist, and exclusive offers.',
  openGraph: mergeOpenGraph({
    title: 'Login | Aarkali Boutique',
    url: '/login',
  }),
}
