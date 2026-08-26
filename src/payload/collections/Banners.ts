import type { CollectionConfig } from 'payload/types'

const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'Banner & Content Management', plural: 'Banner & Content Management' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'position', 'isActive', 'startsAt', 'expiresAt'],
    description: 'Hero banners, promotional banners, and top-bar announcements',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Banner Title',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'position',
      type: 'select',
      label: 'Display Position',
      required: true,
      defaultValue: 'hero',
      options: [
        { label: 'Hero Slider', value: 'hero' },
        { label: 'Top Announcement Bar', value: 'topBar' },
        { label: 'Promotional Section', value: 'promo' },
        { label: 'Category Page', value: 'category' },
        { label: 'Checkout Banner', value: 'checkout' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Banner Image',
      relationTo: 'media',
    },
    {
      name: 'mobileImage',
      type: 'upload',
      label: 'Mobile Banner Image',
      relationTo: 'media',
      admin: { description: 'Separate image optimized for mobile screens (optional)' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Button Label',
          admin: { description: 'e.g. "Shop Now", "Explore Collection"' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'Button URL',
          admin: { description: 'Relative or absolute URL' },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color / Gradient',
      admin: { description: 'CSS color or gradient (e.g. "linear-gradient(135deg, #3d1460, #1a0530)")' },
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Text Color',
      defaultValue: '#ffffff',
    },
    {
      name: 'badgeText',
      type: 'text',
      label: 'Badge / Tag Text',
      admin: { description: 'Small label shown on the banner (e.g. "New Collection", "50% Off")' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: { description: 'Lower numbers display first' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          label: 'Display From',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Display Until',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
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

export default Banners
