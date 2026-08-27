export interface Config {}

export interface User {
  id: string;
  name?: string;
  email: string;
  roles?: ('admin' | 'user')[];
  purchases?: (string | Product)[];
  cart?: {
    items?: {
      product?: string | Product;
      quantity?: number;
      id?: string;
    }[];
  };
}

export interface Media {
  id: string;
  alt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}

export interface Category {
  id: string;
  title: string;
  media?: string | Media;
}

export interface Product {
  id: string;
  title: string;
  publishedOn?: string;
  meta?: {
    title?: string;
    description?: string;
    image?: string | Media;
  };
  priceJSON?: string;
  paywall?: any;
  categories?: (string | Category)[];
  layout?: any[];
  relatedProducts?: (string | Product)[];
  slug?: string;
  stripeProductID?: string;
}

export interface Order {
  id: string;
  orderedBy?: string | User;
  total?: number;
  items?: {
    product?: string | Product;
    price?: number;
    quantity?: number;
    id?: string;
  }[];
  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  trackingId?: string;
  courier?: string;
  courierTrackingUrl?: string;
  deliverySchedule?: string;
  deliveryAddress?: any;
  couponApplied?: string;
  discountAmount?: number;
}

export interface Page {
  id: string;
  title: string;
  hero?: {
    type?: 'highImpact' | 'mediumImpact' | 'lowImpact' | 'customHero';
    richText?: any;
    links?: {
      link: {
        type?: 'reference' | 'custom';
        newTab?: boolean;
        reference?: {
          relationTo: 'pages';
          value: string | Page;
        };
        url?: string;
        label: string;
      };
      id?: string;
    }[];
    media?: string | Media;
  };
  layout?: any[];
  slug?: string;
}

export interface Header {
  navItems?: {
    link: {
      type?: 'reference' | 'custom';
      newTab?: boolean;
      reference?: {
        relationTo: 'pages';
        value: string | Page;
      };
      url?: string;
      label: string;
    };
    id?: string;
  }[];
}

export interface Footer {}

export interface Settings {
  productsPage?: string | Page;
}

export interface CartItems {
  product?: string | Product;
  quantity?: number;
  id?: string;
}
