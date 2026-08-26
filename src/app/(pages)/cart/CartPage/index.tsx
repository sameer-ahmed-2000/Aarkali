'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Page, Settings } from '../../../../payload/payload-types'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import {
  CartIcon,
  TagIcon,
  TruckIcon,
  ShieldIcon,
  CreditCardIcon,
  RefreshIcon,
  CheckCircleIcon,
  XIcon,
  ArrowRightIcon,
} from '../../../_components/Icons'
import CartItem from '../CartItem'

import classes from './index.module.scss'

interface CouponResult {
  valid: boolean
  coupon?: {
    id: string
    code: string
    discountType: 'percentage' | 'fixed' | 'freeShipping'
    value: number
    description?: string
  }
  discountAmount: number
  message?: string
}

const FREE_SHIPPING_THRESHOLD = 999
const STANDARD_SHIPPING_FEE = 99

export const CartPage: React.FC<{
  settings: Settings
  page: Page
}> = () => {
  const { user } = useAuth()
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()

  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  const rawSubtotal = cartTotal?.raw || 0
  const isFreeShipping = rawSubtotal >= FREE_SHIPPING_THRESHOLD || couponResult?.coupon?.discountType === 'freeShipping'
  const shippingFee = rawSubtotal === 0 ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_FEE)
  const discount = couponResult?.discountAmount || 0
  const grandTotal = Math.max(0, rawSubtotal + shippingFee - discount)

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - rawSubtotal)
  const shippingProgress = Math.min(100, Math.round((rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100))

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    setCouponLoading(true)
    setCouponError(null)

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartTotal: rawSubtotal,
        }),
      })

      const data = await res.json()

      if (res.ok && data.valid) {
        setCouponResult(data)
        setCouponCode('')
      } else {
        setCouponError(data.message || 'Invalid or expired coupon code.')
        setCouponResult(null)
      }
    } catch {
      setCouponError('Unable to apply coupon. Please try again.')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponResult(null)
    setCouponError(null)
  }

  if (!hasInitializedCart) {
    return (
      <div className={classes.loading}>
        <LoadingShimmer number={3} />
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className={classes.emptyContainer}>
        <div className={classes.emptyIconWrap}>
          <CartIcon size={48} color="var(--boutique-gold-500)" />
        </div>
        <h2 className={classes.emptyTitle}>Your shopping bag is empty</h2>
        <p className={classes.emptySubtitle}>
          Discover our curated collection of sarees, kurtis, lehengas, and designer jewellery.
        </p>
        <Link href="/products" className={classes.exploreBtn}>
          Start Shopping <ArrowRightIcon size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className={classes.cartContainer}>
      {/* Free Shipping Progress Alert */}
      <div className={classes.shippingProgressBar}>
        <div className={classes.shippingProgressHeader}>
          <div className={classes.shippingProgressLabel}>
            <TruckIcon size={16} />
            <span>
              {isFreeShipping ? (
                <strong>Congratulations! You have unlocked FREE Express Shipping across India.</strong>
              ) : (
                <>Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>FREE Express Shipping</strong></>
              )}
            </span>
          </div>
          <span className={classes.progressPercent}>{shippingProgress}%</span>
        </div>
        <div className={classes.progressTrack}>
          <div
            className={classes.progressBar}
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      <div className={classes.cartLayout}>
        {/* Left Column: Cart Items List */}
        <div className={classes.itemsSection}>
          <div className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>
              Shopping Bag ({cart?.items?.length} item{cart?.items?.length !== 1 ? 's' : ''})
            </h2>
            <Link href="/products" className={classes.continueShoppingLink}>
              &larr; Continue Shopping
            </Link>
          </div>

          <div className={classes.itemsList}>
            {cart?.items?.map(item => {
              if (typeof item.product === 'object' && item.product !== null) {
                const {
                  quantity,
                  product,
                  product: { title, meta },
                } = item

                return (
                  <CartItem
                    key={product.id}
                    product={product}
                    title={title}
                    metaImage={meta?.image}
                    qty={quantity}
                    addItemToCart={addItemToCart}
                  />
                )
              }
              return null
            })}
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon Box */}
        <div className={classes.summarySection}>
          <div className={classes.summaryCard}>
            <h3 className={classes.summaryTitle}>Order Summary</h3>

            {/* Price Breakdown */}
            <div className={classes.summaryRows}>
              <div className={classes.summaryRow}>
                <span>Subtotal</span>
                <span>₹{Math.round(rawSubtotal).toLocaleString('en-IN')}</span>
              </div>

              <div className={classes.summaryRow}>
                <span className={classes.deliveryLabel}>
                  Delivery Charges
                  {isFreeShipping && <span className={classes.freeTag}>FREE</span>}
                </span>
                <span>
                  {isFreeShipping ? (
                    <span className={classes.freeAmount}>FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {couponResult && (
                <div className={`${classes.summaryRow} ${classes.discountRow}`}>
                  <span>Coupon Discount ({couponResult.coupon?.code})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className={classes.divider} />

              <div className={`${classes.summaryRow} ${classes.grandTotalRow}`}>
                <span>Total Amount</span>
                <span className={classes.grandTotalAmount}>
                  ₹{Math.round(grandTotal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Coupon Application Box */}
            <div className={classes.couponBox}>
              {couponResult ? (
                <div className={classes.appliedCoupon}>
                  <div className={classes.appliedCouponInfo}>
                    <TagIcon size={16} />
                    <div>
                      <span className={classes.appliedCode}>{couponResult.coupon?.code}</span>
                      <p className={classes.appliedMsg}>{couponResult.message}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className={classes.removeCouponBtn}
                    aria-label="Remove coupon"
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className={classes.couponForm}>
                  <div className={classes.couponInputWrap}>
                    <TagIcon size={16} className={classes.couponIcon} />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter Coupon Code (e.g. AARKALI40)"
                      className={classes.couponInput}
                      disabled={couponLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className={classes.applyCouponBtn}
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && (
                <p className={classes.couponErrorMsg}>{couponError}</p>
              )}
            </div>

            {/* Checkout Action */}
            <div className={classes.checkoutAction}>
              <Link
                href={user ? '/checkout' : '/login?redirect=%2Fcheckout'}
                className={classes.checkoutButton}
              >
                {user ? 'Proceed to Checkout' : 'Login & Checkout'}
                <ArrowRightIcon size={16} />
              </Link>
            </div>

            {/* Reassurances in sidebar */}
            <div className={classes.reassurances}>
              <div className={classes.reassuranceItem}>
                <ShieldIcon size={15} />
                <span>100% Safe &amp; Secure Checkout via Razorpay</span>
              </div>
              <div className={classes.reassuranceItem}>
                <CreditCardIcon size={15} />
                <span>Cash on Delivery (COD) Available</span>
              </div>
              <div className={classes.reassuranceItem}>
                <RefreshIcon size={15} />
                <span>7-Day Hassle-Free Exchange Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
