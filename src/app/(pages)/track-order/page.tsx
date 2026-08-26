'use client'

import React, { useState } from 'react'

import {
  SearchIcon,
  OrderPlacedIcon,
  OrderConfirmedIcon,
  OrderPackedIcon,
  OrderShippedIcon,
  OrderDeliveredIcon,
  PhoneIcon,
  MailIcon,
  WhatsAppIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from '../../_components/Icons'

import { STORE_PHONE, STORE_EMAIL } from '../../constants'

import classes from './TrackOrder.module.scss'

interface TimelineStep {
  key: string
  label: string
  description: string
  completed: boolean
  active: boolean
  timestamp: string | null
}

interface TrackingResult {
  success: boolean
  order?: {
    id: string
    orderedOn: string
    status: string
    trackingId: string | null
    courier: string | null
    courierTrackingUrl: string | null
    estimatedDelivery: string | null
    paymentMethod: string
    paymentStatus: string
    itemCount: number
    timeline: TimelineStep[]
  }
  message?: string
}

const getStepIcon = (key: string, size = 20) => {
  switch (key) {
    case 'placed':
      return <OrderPlacedIcon size={size} />
    case 'confirmed':
      return <OrderConfirmedIcon size={size} />
    case 'packed':
      return <OrderPackedIcon size={size} />
    case 'shipped':
      return <OrderShippedIcon size={size} />
    case 'out_for_delivery':
    case 'delivered':
      return <OrderDeliveredIcon size={size} />
    default:
      return <CheckCircleIcon size={size} />
  }
}

export default function TrackOrderPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackingResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const isTracking = query.trim().toUpperCase().startsWith('TRK')
      const param = isTracking ? `trackingId=${query.trim()}` : `orderId=${query.trim()}`
      const res = await fetch(`/api/track-order?${param}`)
      const data: TrackingResult = await res.json()
      setResult(data)
    } catch {
      setResult({ success: false, message: 'Unable to connect to server. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className={classes.page}>
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>Track Your Order</h1>
        <p className={classes.heroSubtitle}>
          Enter your Order ID or Courier Tracking Number to receive real-time shipment status
        </p>
      </div>

      <div className={classes.container}>
        {/* Search Form */}
        <div className={classes.searchCard}>
          <form onSubmit={handleSubmit} className={classes.searchForm}>
            <div className={classes.inputWrapper}>
              <SearchIcon size={18} color="var(--theme-text-muted)" className={classes.searchIcon} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. 64a8...) or Tracking ID"
                className={classes.searchInput}
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading || !query.trim()} className={classes.searchBtn}>
              {loading ? <span className={classes.spinner} /> : <>Track Order <ArrowRightIcon size={15} /></>}
            </button>
          </form>
          <p className={classes.searchHint}>
            Your Order ID is available in your order confirmation email and under <strong>My Account &gt; Orders</strong>.
          </p>
        </div>

        {/* Error */}
        {result && !result.success && (
          <div className={classes.errorCard}>
            <p>{result.message}</p>
          </div>
        )}

        {/* Result */}
        {result?.success && result.order && (
          <div className={classes.resultCard}>
            {/* Order Summary */}
            <div className={classes.orderSummary}>
              <div className={classes.orderDetail}>
                <span className={classes.orderLabel}>Order ID</span>
                <span className={classes.orderValue}>#{result.order.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className={classes.orderDetail}>
                <span className={classes.orderLabel}>Placed On</span>
                <span className={classes.orderValue}>{formatDate(result.order.orderedOn)}</span>
              </div>
              <div className={classes.orderDetail}>
                <span className={classes.orderLabel}>Items</span>
                <span className={classes.orderValue}>
                  {result.order.itemCount} item{result.order.itemCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className={classes.orderDetail}>
                <span className={classes.orderLabel}>Payment</span>
                <span className={classes.orderValue}>
                  {result.order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Prepaid)'}
                  {' · '}
                  <span className={result.order.paymentStatus === 'paid' ? classes.paid : classes.pending}>
                    {result.order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </span>
              </div>
              {result.order.trackingId && (
                <div className={classes.orderDetail}>
                  <span className={classes.orderLabel}>Courier Tracking</span>
                  <span className={classes.orderValue}>
                    {result.order.trackingId}
                    {result.order.courierTrackingUrl && (
                      <a
                        href={result.order.courierTrackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.courierLink}
                      >
                        Track on {result.order.courier || 'Courier'} &rarr;
                      </a>
                    )}
                  </span>
                </div>
              )}
              {result.order.estimatedDelivery && (
                <div className={classes.orderDetail}>
                  <span className={classes.orderLabel}>Estimated Delivery</span>
                  <span className={classes.orderValue}>{formatDate(result.order.estimatedDelivery)}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className={classes.timeline}>
              <h2 className={classes.timelineTitle}>Order Status Timeline</h2>
              <div className={classes.timelineSteps}>
                {result.order.timeline.map((step, i) => (
                  <div
                    key={step.key}
                    className={[
                      classes.timelineStep,
                      step.completed && classes.completed,
                      step.active && classes.active,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className={classes.stepLeft}>
                      <div className={classes.stepIconWrap}>
                        {getStepIcon(step.key, 20)}
                      </div>
                      {i < result!.order!.timeline.length - 1 && (
                        <div
                          className={[
                            classes.stepLine,
                            step.completed && classes.stepLineCompleted,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        />
                      )}
                    </div>
                    <div className={classes.stepContent}>
                      <h3 className={classes.stepLabel}>{step.label}</h3>
                      {step.active && <p className={classes.stepDesc}>{step.description}</p>}
                      {step.timestamp && (
                        <p className={classes.stepTime}>
                          <ClockIcon size={12} /> {formatDate(step.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className={classes.helpSection}>
          <h2 className={classes.helpTitle}>Customer Assistance</h2>
          <div className={classes.helpCards}>
            <div className={classes.helpCard}>
              <div className={classes.helpIconWrap}><PhoneIcon size={20} /></div>
              <div>
                <h3>Call Support</h3>
                <p><a href="tel:+919876543210">{STORE_PHONE}</a></p>
              </div>
            </div>
            <div className={classes.helpCard}>
              <div className={classes.helpIconWrap}><WhatsAppIcon size={20} /></div>
              <div>
                <h3>WhatsApp</h3>
                <p>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                    Chat with an expert
                  </a>
                </p>
              </div>
            </div>
            <div className={classes.helpCard}>
              <div className={classes.helpIconWrap}><MailIcon size={20} /></div>
              <div>
                <h3>Email Support</h3>
                <p><a href={`mailto:${STORE_EMAIL}`}>{STORE_EMAIL}</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
