import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { Archive } from '../../blocks/ArchiveBlock'
import { CallToAction } from '../../blocks/CallToAction'
import { Content } from '../../blocks/Content'
import { MediaBlock } from '../../blocks/MediaBlock'
import { slugField } from '../../fields/slug'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
import { beforeProductChange } from './hooks/beforeChange'
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { revalidateProduct } from './hooks/revalidateProduct'

const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product Management',
    plural: 'Product Management',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'price', 'salePrice', 'stock', 'categories', '_status'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  hooks: {
    beforeChange: [beforeProductChange],
    afterChange: [revalidateProduct],
    afterRead: [populateArchiveBlock],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      label: 'Product Title / Name',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'e.g. Kanchipuram Pure Silk Zari Saree',
        description: 'Enter the full boutique product title as displayed to customers',
      },
    },
    {
      name: 'publishedOn',
      label: 'Publish Date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: '📦 Pricing & Stock',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  label: 'Regular MRP Price (₹)',
                  type: 'number',
                  required: true,
                  min: 0,
                  admin: {
                    placeholder: 'e.g. 7500',
                    description: 'Original list tag price in INR (₹)',
                  },
                },
                {
                  name: 'salePrice',
                  label: 'Discounted Selling Price (₹)',
                  type: 'number',
                  min: 0,
                  admin: {
                    placeholder: 'e.g. 4999',
                    description: 'Discounted offer price (leave blank if no discount)',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'sku',
                  label: 'SKU Code',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g. SAREE-001',
                    description: 'Unique Stock Keeping Unit code for inventory tracking',
                  },
                },
                {
                  name: 'stock',
                  label: 'Available Stock Quantity',
                  type: 'number',
                  defaultValue: 10,
                  min: 0,
                  required: true,
                  admin: {
                    placeholder: '10',
                    description: 'Number of items currently available in inventory',
                  },
                },
                {
                  name: 'lowStockThreshold',
                  label: 'Low Stock Alert Limit',
                  type: 'number',
                  defaultValue: 3,
                  min: 0,
                  admin: {
                    placeholder: '3',
                    description: 'Triggers low stock alert on Dashboard when stock drops to or below this',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '📝 Details & Media',
          fields: [
            {
              name: 'layout',
              label: 'Product Content Blocks',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
        {
          label: '🔗 Related Items',
          fields: [
            {
              name: 'relatedProducts',
              label: 'Cross-Sell Recommendations',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              admin: {
                description: 'Select complementary sarees, kurtis, or jewellery items for recommendations',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      label: 'Boutique Category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Select collection category (Sarees, Kurtis, Lehengas, etc.)',
      },
    },
    {
      name: 'isFeatured',
      label: 'Featured Product Showcase',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Highlight on Storefront Homepage Featured Slider',
      },
    },
    slugField(),
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
}

export default Products
