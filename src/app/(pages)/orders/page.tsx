import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Order } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { formatDateTime } from '../../_utilities/formatDateTime'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import {
  PackageIcon,
  TruckIcon,
  SearchIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
} from '../../_components/Icons'

import classes from './index.module.scss'

export default async function Orders() {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to view your orders.',
    )}&redirect=${encodeURIComponent('/orders')}`,
  })

  let orders: Order[] | null = null

  try {
    const { cookies } = await import('next/headers')
    orders = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString(),
      },
      cache: 'no-store',
    })
      ?.then(async res => {
        if (!res.ok) notFound()
        const json = await res.json()
        if ('error' in json && json.error) notFound()
        if ('errors' in json && json.errors) notFound()
        return json
      })
      ?.then(json => json.docs)
  } catch (error) {}

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.hero}>
        <h1 className={classes.heroTitle}>My Orders</h1>
        <p className={classes.heroSubtitle}>View past purchases and live shipment tracking</p>
      </div>

      <Gutter className={classes.ordersContainer}>
        {(!orders || !Array.isArray(orders) || orders?.length === 0) ? (
          <div className={classes.noOrders}>
            <div className={classes.noOrdersIcon}>
              <PackageIcon size={40} color="var(--boutique-gold-500)" />
            </div>
            <h3>No Orders Yet</h3>
            <p>You haven&apos;t placed any orders yet. Explore our handcrafted collections to find your perfect style.</p>
            <Link href="/products" className={classes.shopBtn}>
              Explore Collections <ArrowRightIcon size={16} />
            </Link>
          </div>
        ) : (
          <div className={classes.ordersList}>
            {orders?.map(order => {
              const formattedTotal =
                typeof order.total === 'number'
                  ? `₹${Math.round(order.total > 10000 ? order.total / 100 : order.total).toLocaleString('en-IN')}`
                  : '₹1,499'

              const status = order.status || 'placed'
              const trackingId = order.trackingId || `TRK${order.id?.slice(-8)}`

              return (
                <div key={order.id} className={classes.orderCard}>
                  <div className={classes.orderHeader}>
                    <div className={classes.orderIdInfo}>
                      <span className={classes.orderIdLabel}>Order #{order.id?.slice(-8).toUpperCase()}</span>
                      <span className={classes.orderDate}>
                        <ClockIcon size={13} /> {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div className={classes.orderHeaderRight}>
                      <span className={classes.statusBadge}>
                        <CheckCircleIcon size={12} /> {status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={classes.orderTotal}>{formattedTotal}</span>
                    </div>
                  </div>

                  <div className={classes.orderBody}>
                    <div className={classes.orderMetaRow}>
                      <div>
                        <span className={classes.metaLabel}>Payment Method:</span>{' '}
                        <strong className={classes.metaVal}>
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}
                        </strong>
                      </div>
                      <div>
                        <span className={classes.metaLabel}>Tracking ID:</span>{' '}
                        <span className={classes.trackingCode}>{trackingId}</span>
                      </div>
                      <div>
                        <span className={classes.metaLabel}>Items:</span>{' '}
                        <strong className={classes.metaVal}>{order.items?.length || 1} product(s)</strong>
                      </div>
                    </div>

                    <div className={classes.orderActions}>
                      <Link
                        href={`/track-order?trackingId=${trackingId}`}
                        className={classes.trackBtn}
                      >
                        <SearchIcon size={15} /> Track Shipment
                      </Link>
                      <Link href={`/orders/${order.id}`} className={classes.viewBtn}>
                        View Details <ArrowRightIcon size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Gutter>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'My Orders | Aarkali Boutique',
  description: 'View and track your Aarkali Boutique orders.',
  openGraph: mergeOpenGraph({
    title: 'Orders',
    url: '/orders',
  }),
}
