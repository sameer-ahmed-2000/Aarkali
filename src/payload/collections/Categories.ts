import type { CollectionConfig } from 'payload/types'
import { slugField } from '../fields/slug'

const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category Management',
    plural: 'Category Management',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isFeatured', 'displayOrder'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Category Banner / Icon',
    },
    {
      name: 'isFeatured',
      label: 'Featured Category',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage category showcase',
      },
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers display first',
      },
    },
    slugField(),
  ],
}

export default Categories
