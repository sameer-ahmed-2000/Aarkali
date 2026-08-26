import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { RenderParams } from '../../_components/RenderParams'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import { ArrowRightIcon, ShieldIcon } from '../../_components/Icons'
import { RecoverPasswordForm } from './RecoverPasswordForm'

import classes from './index.module.scss'

export default async function RecoverPassword() {
  return (
    <section className={classes.recoverPage}>
      {/* Left branding panel */}
      <div className={classes.leftPanel}>
        <div className={classes.leftContent}>
          <Link href="/" className={classes.brandLogo}>
            <span className={classes.logoSymbol}>𝒜</span>
            <span className={classes.logoText}>Aarkali Boutique</span>
          </Link>

          <div className={classes.brandMessage}>
            <h2>Account Security &amp; Access</h2>
            <p>
              We ensure your account and purchase history remain safe. Enter your registered email address to receive password reset instructions.
            </p>
          </div>

          <div className={classes.securityBadge}>
            <ShieldIcon size={16} />
            <span>256-Bit SSL Encrypted &amp; Verified</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={classes.rightPanel}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />

          <Link href="/login" className={classes.backLink}>
            &larr; Back to Login
          </Link>

          <div className={classes.formHeader}>
            <h1 className={classes.formTitle}>Forgot Password</h1>
            <p className={classes.formSubtitle}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <RecoverPasswordForm />

          <div className={classes.footerNote}>
            <p>
              Remember your password?{' '}
              <Link href="/login" className={classes.linkHighlight}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Recover Password | Aarkali Boutique',
  description: 'Enter your email address to recover your Aarkali Boutique account password.',
  openGraph: mergeOpenGraph({
    title: 'Recover Password | Aarkali Boutique',
    url: '/recover-password',
  }),
}
