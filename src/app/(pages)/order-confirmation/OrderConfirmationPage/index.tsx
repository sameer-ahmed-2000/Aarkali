'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { useCart } from '../../../_providers/Cart'
import {
  CheckCircleIcon,
  TruckIcon,
  PackageIcon,
  ArrowRightIcon,
  SearchIcon,
  PhoneIcon,
  ClockIcon,
} from '../../../_components/Icons'

import { STORE_PHONE } from '../../../constants'

import classes from './index.module.scss'

export const OrderConfirmationPage: React.FC<{}> = () => {
  const searchParams = useSearchParams()
  const orderID = searchParams.get('order_id')
  const trackingID = searchParams.get('tracking_id') || `TRK${orderID?.slice(-8) || '849201'}`
  const method = searchParams.get('method') || 'cod'
  const error = searchParams.get('error')

  const { clearCart } = useCart()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  const copyTracking = () => {
    navigator.clipboard.writeText(trackingID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className={classes.confirmationCard}>
      {error ? (
        <div className={classes.errorState}>
          <h2>Order Processing Notice</h2>
          <p>{error}</p>
          <div className={classes.actionButtons}>
            <Link href="/account" className={classes.primaryBtn}>
              View Account
            </Link>
            <Link href="/contact" className={classes.secondaryBtn}>
              Contact Support
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className={classes.successIconWrap}>
            <CheckCircleIcon size={56} color="hsl(148, 60%, 45%)" />
          </div>

          <span className={classes.orderBadge}>Order Confirmed</span>
          <h1 className={classes.title}>Thank You for Your Order</h1>
          <p className={classes.subtitle}>
            Your handcrafted boutique order has been received by our atelier and is being prepared with utmost care.
          </p>

          {/* Details Card */}
          <div className={classes.detailsBox}>
            <div className={classes.detailRow}>
              <span className={classes.detailLabel}>Order ID</span>
              <span className={classes.detailValue}>#{orderID ? orderID.slice(-8).toUpperCase() : 'AARKALI-9281'}</span>
            </div>

            <div className={classes.detailRow}>
              <span className={classes.detailLabel}>Tracking ID</span>
              <div className={classes.trackingCopyRow}>
                <span className={classes.trackingCode}>{trackingID}</span>
                <button type="button" onClick={copyTracking} className={classes.copyBtn}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className={classes.detailRow}>
              <span className={classes.detailLabel}>Payment Mode</span>
              <span className={classes.detailValue}>
                {method === 'cod' ? 'Cash on Delivery (Pay at Doorstep)' : 'Online Payment (Confirmed)'}
              </span>
            </div>

            <div className={classes.detailRow}>
              <span className={classes.detailLabel}>Estimated Delivery</span>
              <span className={classes.detailValue}>
                <ClockIcon size={14} /> 3-5 Business Days
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={classes.actionButtons}>
            <Link
              href={`/track-order?trackingId=${trackingID}`}
              className={classes.primaryBtn}
            >
              <SearchIcon size={16} /> Track Shipment Real-Time
            </Link>

            <Link href="/products" className={classes.secondaryBtn}>
              Continue Shopping <ArrowRightIcon size={16} />
            </Link>
          </div>

          {/* Customer support reassurance */}
          <div className={classes.supportNote}>
            <PhoneIcon size={14} />
            <span>Need immediate styling or order assistance? Call us at <strong>{STORE_PHONE}</strong></span>
          </div>
        </>
      )}
    </div>
  )
}

export default OrderConfirmationPage
