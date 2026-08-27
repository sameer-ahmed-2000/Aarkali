import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  siteName: 'Aarkali Boutique',
  title: 'Aarkali Boutique — Premium Indian Fashion',
  description: 'Discover Aarkali Boutique — curated premium ethnic wear, designer sarees, kurtis, lehengas and more.',
  images: [
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://aarkali.in'}/favicon.svg`,
    },
  ],
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
