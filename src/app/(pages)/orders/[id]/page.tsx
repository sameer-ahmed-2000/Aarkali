import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { Order } from '../../../../payload/payload-types'
import { Gutter } from '../../../_components/Gutter'
import { Media } from '../../../_components/Media'
import { formatDateTime } from '../../../_utilities/formatDateTime'
import { getMeUser } from '../../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../../_utilities/mergeOpenGraph'
import {
  TruckIcon,
  SearchIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
  ArrowRightIcon,
} from '../../../_components/Icons'

import classes from './index.module.scss'

export default async function OrderDetailsPage({ params: { id } }: { params: { id: string } }) {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to view this order.',
    )}&redirect=${encodeURIComponent(`/orders/${id}`)}`,
  })

  let order: Order | null = null

  try {
    order = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      cache: 'no-store',
    })?.then(async res => {
      if (!res.ok) notFound()
      const json = await res.json()
      if ('error' in json && json.error) notFound()
      if ('errors' in json && json.errors) notFound()
      return json
    })
  } catch (error) {}

  if (!order) {
    notFound()
  }

  const formattedTotal =
    typeof order.total === 'number'
      ? `₹${Math.round(order.total > 10000 ? order.total / 100 : order.total).toLocaleString('en-IN')}`
      : '₹1,499'

  const trackingId = order.trackingId || `TRK${order.id?.slice(-8)}`
  const status = order.status || 'placed'

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>Order #{order.id?.slice(-8).toUpperCase()}</h1>
        <p className={classes.heroSubtitle}>Placed on {formatDateTime(order.createdAt)}</p>
      </div>

      <Gutter className={classes.container}>
        <div className={classes.grid}>
          {/* Main: Items list */}
          <div className={classes.itemsSection}>
            <div className={classes.cardHeader}>
              <h2 className={classes.cardTitle}>Ordered Items</h2>
              <span className={classes.statusBadge}>
                <CheckCircleIcon size={13} /> {status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className={classes.itemsList}>
              {order.items?.map((item, idx) => {
                if (typeof item.product === 'object' && item.product !== null) {
                  const {
                    quantity,
                    product,
                    product: { title, meta, slug },
                  } = item

                  const metaImage = meta?.image

                  return (
                    <div key={idx} className={classes.itemRow}>
                      <div className={classes.imageWrap}>
                        {metaImage && typeof metaImage !== 'string' ? (
                          <Media
                            className={classes.media}
                            imgClassName={classes.image}
                            resource={metaImage}
                            fill
                          />
                        ) : (
                          <Image
                            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80&auto=format&fit=crop"
                            alt={title || 'Product'}
                            fill
                            className={classes.image}
                          />
                        )}
                      </div>

                      <div className={classes.itemInfo}>
                        <h4 className={classes.itemTitle}>
                          <Link href={`/products/${slug}`}>{title}</Link>
                        </h4>
                        <p className={classes.itemQty}>Quantity: {quantity}</p>
                        <span className={classes.itemPrice}>
                          ₹{item.price ? Math.round(item.price).toLocaleString('en-IN') : '1,499'} each
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>

          {/* Sidebar: Order Summary & Tracking */}
          <div className={classes.sidebar}>
            {/* Tracking Card */}
            <div className={classes.trackingCard}>
              <h3 className={classes.sidebarTitle}>Live Tracking</h3>
              <div className={classes.trackingBox}>
                <span className={classes.trackingLabel}>Tracking ID:</span>
                <span className={classes.trackingCode}>{trackingId}</span>
              </div>
              <Link
                href={`/track-order?trackingId=${trackingId}`}
                className={classes.trackBtn}
              >
                <SearchIcon size={16} /> Track Shipment in Real-Time
              </Link>
            </div>

            {/* Summary Card */}
            <div className={classes.summaryCard}>
              <h3 className={classes.sidebarTitle}>Order Summary</h3>

              <div className={classes.summaryRows}>
                <div className={classes.summaryRow}>
                  <span>Payment Mode</span>
                  <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}</strong>
                </div>

                <div className={classes.summaryRow}>
                  <span>Delivery Speed</span>
                  <strong>{order.deliverySchedule === 'same_day' ? 'Same-Day Priority' : 'Standard (3-5 Days)'}</strong>
                </div>

                <div className={classes.summaryDivider} />

                <div className={`${classes.summaryRow} ${classes.totalRow}`}>
                  <span>Grand Total</span>
                  <span className={classes.totalAmount}>{formattedTotal}</span>
                </div>
              </div>

              <div className={classes.sidebarActions}>
                <Link href="/orders" className={classes.backLink}>
                  &larr; View All Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Gutter>
    </div>
  )
}

export async function generateMetadata({ params: { id } }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Order Details #${id.slice(-8).toUpperCase()} | Aarkali Boutique`,
    description: `Order summary and shipment tracking for #${id}.`,
  }
}
