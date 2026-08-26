import type { CollectionConfig } from 'payload/types'

const Notifications: CollectionConfig = {
  slug: 'notifications',
  labels: { singular: 'Notification Management', plural: 'Notification Management' },
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['user', 'type', 'message', 'isRead', 'createdAt'],
    description: 'Customer notifications for orders, offers, and system messages',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { user: { equals: user.id } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      label: 'Recipient',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Notification Type',
      required: true,
      options: [
        { label: 'Order Placed', value: 'order_placed' },
        { label: 'Order Confirmed', value: 'order_confirmed' },
        { label: 'Order Packed', value: 'order_packed' },
        { label: 'Order Shipped', value: 'order_shipped' },
        { label: 'Order Delivered', value: 'order_delivered' },
        { label: 'Return Initiated', value: 'return_initiated' },
        { label: 'Payment Successful', value: 'payment_success' },
        { label: 'Payment Failed', value: 'payment_failed' },
        { label: 'Offer / Promotional', value: 'offer' },
        { label: 'New Collection Announcement', value: 'new_collection' },
        { label: 'System Notice', value: 'system' },
      ],
    },
    {
      name: 'message',
      type: 'text',
      label: 'Notification Message',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Additional Details',
    },
    {
      name: 'actionUrl',
      type: 'text',
      label: 'Action URL',
      admin: { description: 'URL to navigate to when notification is clicked' },
    },
    {
      name: 'actionLabel',
      type: 'text',
      label: 'Action Button Label',
      admin: { description: 'e.g. "View Order", "Track Package"' },
    },
    {
      name: 'relatedOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Related Order',
    },
    {
      name: 'isRead',
      type: 'checkbox',
      label: 'Read',
      defaultValue: false,
    },
    {
      name: 'readAt',
      type: 'date',
      label: 'Read At',
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}

export default Notifications
