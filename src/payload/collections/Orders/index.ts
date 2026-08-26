import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrLoggedIn } from '../../access/adminsOrLoggedIn'
import { adminsOrOrderedBy } from './access/adminsOrOrderedBy'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { updateUserPurchases } from './hooks/updateUserPurchases'
import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Order Management',
    plural: 'Order Management',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'orderedBy', 'total', 'status', 'deliveryType', 'createdAt'],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
  },
  hooks: {
    afterChange: [updateUserPurchases, clearUserCart],
  },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: adminsOrLoggedIn,
    delete: admins,
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      hooks: {
        beforeChange: [populateOrderedBy],
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      defaultValue: 'cod',
      options: [
        { label: 'Cash on Delivery (COD)', value: 'cod' },
        { label: 'Online Payment / UPI', value: 'online' },
        { label: 'Credit / Debit Card', value: 'card' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'placed',
      options: [
        { label: 'Order Placed', value: 'placed' },
        { label: 'Order Confirmed', value: 'confirmed' },
        { label: 'Order Packed', value: 'packed' },
        { label: 'Order Shipped', value: 'shipped' },
        { label: 'Out for Delivery', value: 'out_for_delivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'trackingId',
      label: 'Tracking ID',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'courier',
      label: 'Courier Partner',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'courierTrackingUrl',
      label: 'Courier Tracking URL',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'deliveryType',
          label: 'Delivery Type',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard Delivery (3-5 Days)', value: 'standard' },
            { label: 'Same-Day Express Delivery', value: 'same_day' },
            { label: 'Scheduled Slot Delivery', value: 'scheduled' },
          ],
        },
        {
          name: 'deliverySchedule',
          label: 'Delivery Category',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard Delivery (3-5 Days)', value: 'standard' },
            { label: 'Same-Day / Express Delivery', value: 'same_day' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'scheduledDate',
          label: 'Scheduled Delivery Date',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            condition: (data) => data?.deliveryType === 'scheduled' || data?.deliveryType === 'same_day',
          },
        },
        {
          name: 'deliverySlot',
          label: 'Delivery Time Slot Window',
          type: 'select',
          options: [
            { label: 'Morning (9:00 AM - 12:00 PM)', value: '9am_12pm' },
            { label: 'Afternoon (12:00 PM - 3:00 PM)', value: '12pm_3pm' },
            { label: 'Evening (3:00 PM - 6:00 PM)', value: '3pm_6pm' },
            { label: 'Night (6:00 PM - 9:00 PM)', value: '6pm_9pm' },
          ],
          admin: {
            condition: (data) => data?.deliveryType === 'scheduled' || data?.deliveryType === 'same_day',
          },
        },
      ],
    },
    {
      name: 'deliveryAddress',
      type: 'json',
    },
    {
      name: 'couponApplied',
      type: 'text',
    },
    {
      name: 'discountAmount',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 0,
        },
      ],
    },
  ],
}
