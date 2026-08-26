import type { CollectionConfig } from 'payload/types'

const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Review', plural: 'Reviews' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'customer', 'rating', 'status', 'createdAt'],
    description: 'Customer product reviews and ratings',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      // Public can read only approved reviews
      return { status: { equals: 'approved' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Review Title',
      required: true,
      maxLength: 100,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Customer',
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Rating (1–5)',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Review Comment',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Review Images',
      maxRows: 5,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'isVerifiedPurchase',
      type: 'checkbox',
      label: 'Verified Purchase',
      defaultValue: false,
      admin: { description: 'Auto-set when the customer has purchased this product' },
    },
    {
      name: 'helpfulCount',
      type: 'number',
      label: 'Helpful Votes',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      required: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    {
      name: 'adminNote',
      type: 'textarea',
      label: 'Admin Note (Internal)',
      admin: {
        position: 'sidebar',
        description: 'Internal note about why this review was approved/rejected',
      },
    },
  ],
  timestamps: true,
}

export default Reviews
