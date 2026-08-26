import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { RenderParams } from '../../_components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import { SparkleIcon, ShieldIcon, TruckIcon, RefreshIcon } from '../../_components/Icons'
import CreateAccountForm from './CreateAccountForm'

import classes from './index.module.scss'

export default async function CreateAccount() {
  await getMeUser({
    validUserRedirect: `/account?warning=${encodeURIComponent(
      'Cannot create a new account while logged in, please log out and try again.',
    )}`,
  })

  return (
    <section className={classes.createAccount}>
      {/* Left Boutique Branding Panel */}
      <div className={classes.brandPanel}>
        <div className={classes.brandContent}>
          <Link href="/" className={classes.brandLogo}>
            Aarkali
          </Link>
          <span className={classes.brandTagline}>Handcrafted Boutique &amp; Ethnic Couture</span>

          <div className={classes.perksList}>
            <div className={classes.perkItem}>
              <SparkleIcon size={18} color="var(--boutique-gold-400)" />
              <div>
                <strong>Curated Atelier Collections</strong>
                <p>Early access to seasonal drops, silk sarees &amp; bridal couture</p>
              </div>
            </div>

            <div className={classes.perkItem}>
              <TruckIcon size={18} color="var(--boutique-gold-400)" />
              <div>
                <strong>Free Express Shipping</strong>
                <p>Doorstep delivery across all Indian pin codes above ₹999</p>
              </div>
            </div>

            <div className={classes.perkItem}>
              <RefreshIcon size={18} color="var(--boutique-gold-400)" />
              <div>
                <strong>7-Day Easy Returns</strong>
                <p>Hassle-free exchanges and instant store credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />

          <div className={classes.formHeader}>
            <h1 className={classes.formTitle}>Join Aarkali Club</h1>
            <p className={classes.formSubtitle}>
              Create your boutique account to save your wishlist and track orders
            </p>
          </div>

          <CreateAccountForm />
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Create Account | Aarkali Boutique',
  description: 'Create an account at Aarkali Boutique to track orders and save your wishlist.',
  openGraph: mergeOpenGraph({
    title: 'Create Account | Aarkali Boutique',
    url: '/create-account',
  }),
}
