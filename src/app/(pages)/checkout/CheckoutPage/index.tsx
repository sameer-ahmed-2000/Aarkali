'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Settings } from '../../../../payload/payload-types'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import {
  ShieldIcon,
  TruckIcon,
  CreditCardIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LockIcon,
} from '../../../_components/Icons'
import { CheckoutItem } from '../CheckoutItem'

import classes from './index.module.scss'

const FREE_SHIPPING_THRESHOLD = 999
const STANDARD_SHIPPING = 99
const SAME_DAY_SHIPPING = 149

export const CheckoutPage: React.FC<{
  settings: Settings
}> = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart, cartIsEmpty, cartTotal, clearCart } = useCart()

  // Form states
  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Tamil Nadu')
  const [pincode, setPincode] = useState('')

  // Options
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'same_day'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rawSubtotal = cartTotal?.raw || 0
  const isStandardFree = rawSubtotal >= FREE_SHIPPING_THRESHOLD

  const shippingCost =
    deliverySpeed === 'same_day'
      ? SAME_DAY_SHIPPING
      : isStandardFree
      ? 0
      : STANDARD_SHIPPING

  const grandTotal = rawSubtotal + shippingCost

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
  }, [router, user, cartIsEmpty])

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !pincode.trim()) {
      setError('Please complete all required delivery address fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const orderPayload = {
        userId: user?.id,
        items: cart?.items?.map(item => ({
          product: typeof item.product === 'object' ? item.product.id : item.product,
          price: typeof item.product === 'object'
            ? JSON.parse(item.product.priceJSON || '{}')?.data?.[0]?.unit_amount / 100 || 1499
            : 1499,
          quantity: item.quantity || 1,
        })),
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        deliverySchedule: deliverySpeed,
        deliveryAddress: {
          fullName,
          email,
          phone,
          addressLine,
          city,
          state,
          pincode,
        },
      }

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        clearCart()
        router.push(
          `/order-confirmation?order_id=${data.orderId}&tracking_id=${data.trackingId}&method=${paymentMethod}`,
        )
      } else {
        setError(data.message || 'Unable to place order. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartIsEmpty) {
    return (
      <div className={classes.empty}>
        <p>Your shopping bag is empty.</p>
        <Link href="/products" className={classes.continueBtn}>
          Browse Collections &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className={classes.checkoutContainer}>
      <form onSubmit={handlePlaceOrder} className={classes.checkoutLayout}>
        {/* Left Column: Form Steps */}
        <div className={classes.formColumn}>
          {/* Step 1: Delivery Address */}
          <div className={classes.stepCard}>
            <div className={classes.stepHeader}>
              <div className={classes.stepNumber}>1</div>
              <div>
                <h2 className={classes.stepTitle}>Delivery Address</h2>
                <p className={classes.stepSubtitle}>Where should we deliver your boutique order?</p>
              </div>
            </div>

            <div className={classes.formGrid}>
              <div className={classes.inputGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className={classes.input}
                />
              </div>

              <div className={classes.inputGroup}>
                <label>Phone Number (for SMS Tracking updates) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={classes.input}
                />
              </div>

              <div className={`${classes.inputGroup} ${classes.fullWidth}`}>
                <label>Street Address / Apartment / Flat No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 42 Rose Garden Avenue, Anna Nagar"
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  className={classes.input}
                />
              </div>

              <div className={classes.inputGroup}>
                <label>City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className={classes.input}
                />
              </div>

              <div className={classes.inputGroup}>
                <label>State *</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className={classes.select}
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Other">Other States</option>
                </select>
              </div>

              <div className={classes.inputGroup}>
                <label>PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 600040"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className={classes.input}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Speed */}
          <div className={classes.stepCard}>
            <div className={classes.stepHeader}>
              <div className={classes.stepNumber}>2</div>
              <div>
                <h2 className={classes.stepTitle}>Delivery Preference</h2>
                <p className={classes.stepSubtitle}>Choose your preferred shipping timeframe</p>
              </div>
            </div>

            <div className={classes.radioOptions}>
              <label
                className={[
                  classes.radioCard,
                  deliverySpeed === 'standard' && classes.radioCardActive,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name="deliverySpeed"
                  value="standard"
                  checked={deliverySpeed === 'standard'}
                  onChange={() => setDeliverySpeed('standard')}
                />
                <div className={classes.radioContent}>
                  <div className={classes.radioTop}>
                    <strong>Standard Delivery (3-5 Business Days)</strong>
                    <span className={classes.radioPrice}>
                      {isStandardFree ? 'FREE' : `₹${STANDARD_SHIPPING}`}
                    </span>
                  </div>
                  <p>Reliable doorstep delivery via Blue Dart / Delhivery Express</p>
                </div>
              </label>

              <label
                className={[
                  classes.radioCard,
                  deliverySpeed === 'same_day' && classes.radioCardActive,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name="deliverySpeed"
                  value="same_day"
                  checked={deliverySpeed === 'same_day'}
                  onChange={() => setDeliverySpeed('same_day')}
                />
                <div className={classes.radioContent}>
                  <div className={classes.radioTop}>
                    <strong>Same-Day / Express Priority Dispatch</strong>
                    <span className={classes.radioPrice}>₹{SAME_DAY_SHIPPING}</span>
                  </div>
                  <p>Guaranteed dispatch within 12 hours with dedicated priority courier</p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className={classes.stepCard}>
            <div className={classes.stepHeader}>
              <div className={classes.stepNumber}>3</div>
              <div>
                <h2 className={classes.stepTitle}>Payment Method</h2>
                <p className={classes.stepSubtitle}>All transactions are 100% encrypted &amp; verified</p>
              </div>
            </div>

            <div className={classes.radioOptions}>
              <label
                className={[
                  classes.radioCard,
                  paymentMethod === 'cod' && classes.radioCardActive,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div className={classes.radioContent}>
                  <div className={classes.radioTop}>
                    <strong>Cash on Delivery (COD)</strong>
                    <span className={classes.badgeFree}>No extra fees</span>
                  </div>
                  <p>Pay with cash or scan UPI QR code upon arrival at your doorstep</p>
                </div>
              </label>

              <label
                className={[
                  classes.radioCard,
                  paymentMethod === 'razorpay' && classes.radioCardActive,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                />
                <div className={classes.radioContent}>
                  <div className={classes.radioTop}>
                    <strong>Razorpay / UPI / NetBanking / Cards</strong>
                    <span className={classes.badgeInstant}>Instant Confirmation</span>
                  </div>
                  <p>Pay securely via Google Pay, PhonePe, Paytm, Credit/Debit Cards</p>
                </div>
              </label>
            </div>
          </div>

          {error && <div className={classes.errorBanner}>{error}</div>}
        </div>

        {/* Right Column: Order Summary */}
        <div className={classes.summaryColumn}>
          <div className={classes.summaryCard}>
            <h3 className={classes.summaryTitle}>Review Order</h3>

            {/* Products preview */}
            <div className={classes.itemsSummaryList}>
              {cart?.items?.map((item, idx) => {
                if (typeof item.product === 'object' && item.product !== null) {
                  return (
                    <div key={idx} className={classes.summaryItemRow}>
                      <div className={classes.summaryItemInfo}>
                        <span className={classes.summaryItemQty}>{item.quantity}x</span>
                        <span className={classes.summaryItemTitle}>{item.product.title}</span>
                      </div>
                      <span className={classes.summaryItemPrice}>
                        ₹{item.product.priceJSON ? Math.round((JSON.parse(item.product.priceJSON)?.data?.[0]?.unit_amount / 100 || 1499) * item.quantity).toLocaleString('en-IN') : '1,499'}
                      </span>
                    </div>
                  )
                }
                return null
              })}
            </div>

            <div className={classes.summaryDivider} />

            {/* Calculations */}
            <div className={classes.calcRows}>
              <div className={classes.calcRow}>
                <span>Bag Total</span>
                <span>₹{Math.round(rawSubtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className={classes.calcRow}>
                <span>Shipping Fee</span>
                <span>{shippingCost === 0 ? <strong className={classes.freeText}>FREE</strong> : `₹${shippingCost}`}</span>
              </div>
              <div className={`${classes.calcRow} ${classes.grandTotalRow}`}>
                <span>Payable Amount</span>
                <span className={classes.grandTotalNumber}>
                  ₹{Math.round(grandTotal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className={classes.placeOrderBtn}
            >
              {loading ? (
                'Processing Order...'
              ) : (
                <>
                  <LockIcon size={16} /> Place Order (₹{Math.round(grandTotal).toLocaleString('en-IN')})
                </>
              )}
            </button>

            {/* Security note */}
            <div className={classes.securityNote}>
              <ShieldIcon size={14} />
              <span>256-Bit SSL Encrypted Boutique Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
