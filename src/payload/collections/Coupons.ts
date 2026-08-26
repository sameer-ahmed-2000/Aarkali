import type { CollectionConfig } from 'payload/types'

const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: { singular: 'Offers & Coupon Management', plural: 'Offers & Coupon Management' },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'value', 'usageCount', 'maxUses', 'expiresAt', 'isActive'],
    description: 'Manage discount codes and promotional offers',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      label: 'Coupon Code',
      required: true,
      unique: true,
      admin: {
        description: 'Uppercase code customers enter at checkout (e.g. AARKALI20)',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value),
        ],
      },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      admin: { description: 'Internal note about this coupon' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'discountType',
          type: 'select',
          label: 'Discount Type',
          required: true,
          defaultValue: 'percentage',
          options: [
            { label: 'Percentage (%)', value: 'percentage' },
            { label: 'Fixed Amount (₹)', value: 'fixed' },
            { label: 'Free Shipping', value: 'freeShipping' },
          ],
        },
        {
          name: 'value',
          type: 'number',
          label: 'Discount Value',
          required: true,
          min: 0,
          admin: {
            description: 'Percentage (0-100) or fixed rupee amount',
            condition: (data) => data?.discountType !== 'freeShipping',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'minOrderAmount',
          type: 'number',
          label: 'Minimum Order Amount (₹)',
          min: 0,
          defaultValue: 0,
          admin: { description: 'Minimum cart value required to apply this coupon' },
        },
        {
          name: 'maxDiscountAmount',
          type: 'number',
          label: 'Maximum Discount Cap (₹)',
          min: 0,
          admin: {
            description: 'Maximum discount allowed (useful for percentage coupons)',
            condition: (data) => data?.discountType === 'percentage',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxUses',
          type: 'number',
          label: 'Maximum Uses',
          min: 1,
          admin: { description: 'Total number of times this coupon can be used (leave blank for unlimited)' },
        },
        {
          name: 'maxUsesPerUser',
          type: 'number',
          label: 'Max Uses per Customer',
          defaultValue: 1,
          min: 1,
        },
        {
          name: 'usageCount',
          type: 'number',
          label: 'Times Used',
          defaultValue: 0,
          admin: { readOnly: true, description: 'Auto-updated when coupon is applied' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          label: 'Valid From',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Expires At',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'applicableCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Applicable Categories',
      admin: { description: 'Leave blank to apply to all products' },
    },
    {
      name: 'applicableProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Applicable Products',
      admin: { description: 'Leave blank to apply to all products' },
    },
    {
      name: 'firstTimeOnly',
      type: 'checkbox',
      label: 'First Order Only',
      defaultValue: false,
      admin: { description: 'Only allow for customers placing their first order' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}

export default Coupons
