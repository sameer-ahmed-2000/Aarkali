import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { cartPage } from './cart-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { image3 } from './image-3'
import { productsPage } from './products-page'

const collections = ['categories', 'media', 'pages', 'products', 'orders', 'coupons', 'banners', 'notifications']
const globals = ['header', 'settings', 'footer']

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding database with boutique dummy data...')

  payload.logger.info(`— Clearing media...`)
  const mediaDir = path.resolve(__dirname, '../../media')
  if (fs.existsSync(mediaDir)) {
    fs.rmdirSync(mediaDir, { recursive: true })
  }

  payload.logger.info(`— Clearing collections and globals...`)
  for (const collection of collections) {
    try {
      await payload.delete({
        collection: collection as 'products',
        where: {},
      })
    } catch (e) {}
  }
  for (const global of globals) {
    try {
      await payload.updateGlobal({
        slug: global as 'header',
        data: {},
      })
    } catch (e) {}
  }

  payload.logger.info(`— Seeding admin user...`)
  try {
    const existingAdmins = await payload.find({
      collection: 'users',
      where: { email: { equals: 'demo@admin.com' } },
    })
    if (existingAdmins.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'demo@admin.com',
          password: '123456789',
          name: 'Demo Admin',
          roles: ['admin'],
        },
      })
    }
  } catch (e) {}

  payload.logger.info(`— Seeding media...`)
  const [image1Doc, image2Doc, image3Doc] = await Promise.all([
    await payload.create({
      collection: 'media',
      filePath: path.resolve(__dirname, 'image-1.jpg'),
      data: image1,
    }),
    await payload.create({
      collection: 'media',
      filePath: path.resolve(__dirname, 'image-2.jpg'),
      data: image2,
    }),
    await payload.create({
      collection: 'media',
      filePath: path.resolve(__dirname, 'image-3.jpg'),
      data: image3,
    }),
  ])

  payload.logger.info(`— Seeding boutique categories...`)
  const [sareesCat, kurtisCat, lehengasCat, jewelleryCat, dupattasCat] = await Promise.all([
    payload.create({
      collection: 'categories',
      data: { title: 'Sarees', slug: 'sarees', isFeatured: true, displayOrder: 1 },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Kurtis', slug: 'kurtis', isFeatured: true, displayOrder: 2 },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Lehengas', slug: 'lehengas', isFeatured: true, displayOrder: 3 },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Jewellery', slug: 'jewellery', isFeatured: true, displayOrder: 4 },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Dupattas', slug: 'dupattas', isFeatured: false, displayOrder: 5 },
    }),
  ])

  payload.logger.info(`— Seeding client frontend products...`)
  const productDocs = await Promise.all([
    payload.create({
      collection: 'products',
      data: {
        title: 'Banarasi Silk Saree',
        slug: 'banarasi-silk-saree',
        sku: 'BANARASI-001',
        price: 7500,
        salePrice: 4999,
        stock: 15,
        lowStockThreshold: 5,
        isFeatured: true,
        _status: 'published',
        categories: [sareesCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Kanjeevaram Pure Silk Saree',
        slug: 'kanjeevaram-pure-silk-saree',
        sku: 'KANJEE-002',
        price: 12000,
        salePrice: 8999,
        stock: 8,
        lowStockThreshold: 3,
        isFeatured: true,
        _status: 'published',
        categories: [sareesCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Chanderi Handloom Silk Saree',
        slug: 'chanderi-handloom-silk-saree',
        sku: 'CHANDERI-003',
        price: 4500,
        salePrice: 3499,
        stock: 22,
        lowStockThreshold: 5,
        isFeatured: false,
        _status: 'published',
        categories: [sareesCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Georgette Embroidered Saree',
        slug: 'georgette-embroidered-saree',
        sku: 'GEORGETTE-004',
        price: 3999,
        salePrice: 2799,
        stock: 18,
        lowStockThreshold: 4,
        isFeatured: false,
        _status: 'published',
        categories: [sareesCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Anarkali Festive Kurti Set',
        slug: 'anarkali-festive-kurti-set',
        sku: 'ANARKALI-005',
        price: 2999,
        salePrice: 1899,
        stock: 30,
        lowStockThreshold: 5,
        isFeatured: true,
        _status: 'published',
        categories: [kurtisCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Chanderi Silk Floral Kurti',
        slug: 'chanderi-silk-floral-kurti',
        sku: 'KURTI-006',
        price: 2200,
        salePrice: 1499,
        stock: 25,
        lowStockThreshold: 5,
        isFeatured: false,
        _status: 'published',
        categories: [kurtisCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Cotton Hand-Block Printed Kurti',
        slug: 'cotton-hand-block-printed-kurti',
        sku: 'BLOCK-007',
        price: 1200,
        salePrice: 799,
        stock: 40,
        lowStockThreshold: 8,
        isFeatured: false,
        _status: 'published',
        categories: [kurtisCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Flared Palazzo Kurti Ensemble',
        slug: 'flared-palazzo-kurti-ensemble',
        sku: 'PALAZZO-008',
        price: 3200,
        salePrice: 2199,
        stock: 12,
        lowStockThreshold: 3,
        isFeatured: true,
        _status: 'published',
        categories: [kurtisCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Bridal Velvet Lehenga Choli',
        slug: 'bridal-velvet-lehenga-choli',
        sku: 'LEHENGA-009',
        price: 18000,
        salePrice: 12999,
        stock: 2,
        lowStockThreshold: 3,
        isFeatured: true,
        _status: 'published',
        categories: [lehengasCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Party Wear Semi-Stitched Lehenga',
        slug: 'party-wear-semi-stitched-lehenga',
        sku: 'LEHENGA-010',
        price: 8500,
        salePrice: 5999,
        stock: 0,
        lowStockThreshold: 3,
        isFeatured: false,
        _status: 'published',
        categories: [lehengasCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Silk Brocade Festive Lehenga',
        slug: 'silk-brocade-festive-lehenga',
        sku: 'LEHENGA-011',
        price: 13500,
        salePrice: 9499,
        stock: 6,
        lowStockThreshold: 3,
        isFeatured: true,
        _status: 'published',
        categories: [lehengasCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Antique Temple Gold Jhumkas',
        slug: 'antique-temple-gold-jhumkas',
        sku: 'JEWEL-012',
        price: 1500,
        salePrice: 899,
        stock: 50,
        lowStockThreshold: 10,
        isFeatured: true,
        _status: 'published',
        categories: [jewelleryCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Kundan Royal Choker Set',
        slug: 'kundan-royal-choker-set',
        sku: 'JEWEL-013',
        price: 3800,
        salePrice: 2499,
        stock: 14,
        lowStockThreshold: 4,
        isFeatured: true,
        _status: 'published',
        categories: [jewelleryCat.id],
      },
    }),
    payload.create({
      collection: 'products',
      data: {
        title: 'Zari Bordered Banarasi Dupatta',
        slug: 'zari-bordered-banarasi-dupatta',
        sku: 'DUPATTA-014',
        price: 1999,
        salePrice: 1299,
        stock: 35,
        lowStockThreshold: 5,
        isFeatured: false,
        _status: 'published',
        categories: [dupattasCat.id],
      },
    }),
  ])

  payload.logger.info(`— Seeding coupons...`)
  await Promise.all([
    payload.create({
      collection: 'coupons',
      data: {
        code: 'WELCOME10',
        discountType: 'percentage',
        value: 10,
        usageCount: 14,
        maxUses: 100,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'coupons',
      data: {
        code: 'FESTIVE2000',
        discountType: 'fixed',
        value: 2000,
        usageCount: 8,
        maxUses: 50,
        isActive: true,
      },
    }),
    payload.create({
      collection: 'coupons',
      data: {
        code: 'BRIDAL15',
        discountType: 'percentage',
        value: 15,
        usageCount: 3,
        maxUses: 25,
        isActive: true,
      },
    }),
  ])

  payload.logger.info(`— Seeding banners...`)
  await Promise.all([
    payload.create({
      collection: 'banners',
      data: {
        title: 'Festive Luxury Collection 2026',
        subtitle: 'Handcrafted Kanchipuram Silk Sarees & Velvet Lehengas',
        position: 'hero',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'banners',
      data: {
        title: 'Same-Day Express Dispatch Available',
        subtitle: 'Order before 12 PM for same-day boutique delivery in select cities',
        position: 'topBar',
        isActive: true,
      },
    }),
    payload.create({
      collection: 'banners',
      data: {
        title: 'Exclusive Kundan Jewellery Showcase',
        subtitle: 'Get 15% off on Royal Kundan & Temple Necklaces',
        position: 'promo',
        isActive: true,
      },
    }),
  ])

  payload.logger.info(`— Seeding notifications...`)
  await Promise.all([
    payload.create({
      collection: 'notifications',
      data: {
        type: 'order_shipped',
        message: 'Express Order #BD-9823101 dispatched for Same-Day delivery (Slot 12pm-3pm)',
        isRead: false,
      },
    }),
    payload.create({
      collection: 'notifications',
      data: {
        type: 'system',
        message: 'Stock Warning: Bridal Velvet Lehenga Choli has only 2 items remaining!',
        isRead: false,
      },
    }),
    payload.create({
      collection: 'notifications',
      data: {
        type: 'offer',
        message: 'Festive Offer: Use code FESTIVE2000 to get ₹2,000 off orders over ₹15,000',
        isRead: true,
      },
    }),
  ])

  payload.logger.info(`— Seeding orders...`)
  await Promise.all([
    payload.create({
      collection: 'orders',
      data: {
        total: 12999,
        status: 'confirmed',
        deliveryType: 'same_day',
        deliverySlot: '12pm_3pm',
        courier: 'BlueDart Express',
        trackingId: 'BD-9823101',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        items: [{ product: productDocs[8].id, price: 12999, quantity: 1 }],
      },
    }),
    payload.create({
      collection: 'orders',
      data: {
        total: 8999,
        status: 'shipped',
        deliveryType: 'scheduled',
        scheduledDate: '2026-08-28T00:00:00.000Z',
        deliverySlot: '3pm_6pm',
        courier: 'Delhivery',
        trackingId: 'DL-4819202',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        items: [{ product: productDocs[1].id, price: 8999, quantity: 1 }],
      },
    }),
    payload.create({
      collection: 'orders',
      data: {
        total: 4999,
        status: 'delivered',
        deliveryType: 'standard',
        courier: 'DTDC',
        trackingId: 'DT-1102934',
        paymentStatus: 'paid',
        paymentMethod: 'cod',
        items: [{ product: productDocs[0].id, price: 4999, quantity: 1 }],
      },
    }),
  ])

  payload.logger.info(`— Seeding pages & globals...`)
  const productsPageDoc = await payload.create({
    collection: 'pages',
    data: productsPage,
  })

  await payload.updateGlobal({
    slug: 'settings',
    data: {
      productsPage: productsPageDoc.id,
    },
  })

  payload.logger.info('Seeded database successfully with full client frontend boutique dummy data!')
}
