import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

import { Gutter } from '../../_components/Gutter'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import { ResetPasswordForm } from './ResetPasswordForm'

import classes from './index.module.scss'

export default async function ResetPassword() {
  return (
    <div className={classes.page}>
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>Create New Password</h1>
        <p className={classes.heroSubtitle}>Set a secure new password for your Aarkali account</p>
      </div>

      <Gutter className={classes.container}>
        <div className={classes.card}>
          <ResetPasswordForm />
          <div className={classes.backLinkRow}>
            <Link href="/login" className={classes.backLink}>
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </Gutter>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Reset Password | Aarkali Boutique',
  description: 'Set a new password for your Aarkali Boutique account.',
  openGraph: mergeOpenGraph({
    title: 'Reset Password | Aarkali Boutique',
    url: '/reset-password',
  }),
}
