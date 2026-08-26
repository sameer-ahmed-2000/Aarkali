// Feature Flags Configuration for Payload CMS Admin Workflow
// Controls visibility and loading of collections, globals, and plugins.

export const FEATURE_FLAGS = {
  // Feature flag to show/hide extra template globals (Header & Footer)
  enableExtraGlobals: process.env.PAYLOAD_PUBLIC_ENABLE_EXTRA_GLOBALS === 'true',
  
  // Feature flag to show/hide general CMS pages collection
  enablePagesCollection: process.env.PAYLOAD_PUBLIC_ENABLE_PAGES === 'true',

  // Feature flag to show/hide reviews collection
  enableReviewsCollection: process.env.PAYLOAD_PUBLIC_ENABLE_REVIEWS === 'true',
}
