import * as React from 'react'
import { Select, Text, useFormFields } from 'payload/components/forms'
import CopyToClipboard from 'payload/dist/admin/components/elements/CopyToClipboard'
import { TextField } from 'payload/dist/fields/config/types'

export const LinkToPaymentIntent: React.FC<TextField> = props => {
  const { name, label } = props

  const { value: stripePaymentIntentID } = useFormFields(([fields]) => fields[name]) || {}

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }payments/${stripePaymentIntentID}`

  return (
    <div style={{ marginBottom: '1rem' }}>
      <p style={{ marginBottom: '0.4rem', fontWeight: '600', color: 'var(--admin-accent, #e09874)' }}>
        {typeof label === 'string' ? label : 'Stripe Payment Intent ID'}
      </p>
      <Text {...props} label="" />
      {Boolean(stripePaymentIntentID) && (
        <div style={{ marginTop: '0.5rem' }}>
          <div>
            <span
              className="label"
              style={{
                color: 'var(--admin-text-secondary, #c4b5fd)',
                fontSize: '0.82rem',
                fontWeight: '600',
              }}
            >
              {`Manage in Stripe`}
            </span>
            <CopyToClipboard value={href} />
          </div>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: '600',
              marginTop: '0.25rem',
            }}
          >
            <a
              href={`https://dashboard.stripe.com/${
                process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
              }customers/${stripePaymentIntentID}`}
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: 'var(--admin-accent-bright, #f3c299)' }}
            >
              {href}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
