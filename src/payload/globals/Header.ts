import type { GlobalConfig } from 'payload/types'
import link from '../fields/link'
import { FEATURE_FLAGS } from '../utilities/featureFlags'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    hidden: () => !FEATURE_FLAGS.enableExtraGlobals,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
}
