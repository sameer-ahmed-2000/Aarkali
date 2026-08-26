import type { PayloadHandler } from 'payload/config'

export const getAdminAnalytics: PayloadHandler = async (req, res) => {
  const { payload, user } = req

  if (!user || !user.roles?.includes('admin')) {
    return res.status(401).json({ error: 'Unauthorized: Admin access required' })
  }

  try {
    // 1. Fetch Orders
    const ordersResult = await payload.find({
      collection: 'orders',
      limit: 500,
      depth: 1,
    })

    const orders = ordersResult.docs || []
    const totalOrders = ordersResult.totalDocs || 0
    let totalRevenue = 0
    let pendingOrdersCount = 0
    let sameDayDeliveries = 0
    let scheduledDeliveries = 0
    let standardDeliveries = 0

    orders.forEach((order: any) => {
      if (typeof order.total === 'number') {
        totalRevenue += order.total
      }
      if (order.status === 'placed' || order.status === 'confirmed' || order.status === 'packed') {
        pendingOrdersCount++
      }
      if (order.deliveryType === 'same_day') {
        sameDayDeliveries++
      } else if (order.deliveryType === 'scheduled') {
        scheduledDeliveries++
      } else {
        standardDeliveries++
      }
    })

    // 2. Fetch Products
    const productsResult = await payload.find({
      collection: 'products',
      limit: 500,
      depth: 0,
    })

    const products = productsResult.docs || []
    const totalProducts = productsResult.totalDocs || 0
    const lowStockProducts: any[] = []

    products.forEach((prod: any) => {
      const stock = typeof prod.stock === 'number' ? prod.stock : 10
      const threshold = typeof prod.lowStockThreshold === 'number' ? prod.lowStockThreshold : 5
      if (stock <= threshold) {
        lowStockProducts.push({
          id: prod.id,
          title: prod.title,
          sku: prod.sku || 'N/A',
          stock,
          threshold,
        })
      }
    })

    // 3. Fetch Customers Count
    const usersResult = await payload.find({
      collection: 'users',
      limit: 1,
      where: {
        roles: {
          contains: 'customer',
        },
      },
    })
    const totalCustomers = usersResult.totalDocs || 0

    // 4. Fetch Active Coupons
    const couponsResult = await payload.find({
      collection: 'coupons' as any,
      limit: 100,
      where: {
        isActive: {
          equals: true,
        },
      },
    })
    const activeCoupons = couponsResult.totalDocs || 0

    // 5. Fetch Active Banners
    const bannersResult = await payload.find({
      collection: 'banners' as any,
      limit: 100,
      where: {
        isActive: {
          equals: true,
        },
      },
    })
    const activeBanners = bannersResult.totalDocs || 0

    // 6. Recent 5 Orders
    const recentOrders = orders.slice(0, 5).map((ord: any) => ({
      id: ord.id,
      customerName:
        typeof ord.orderedBy === 'object' && ord.orderedBy
          ? ord.orderedBy.name || ord.orderedBy.email
          : 'Guest',
      total: ord.total || 0,
      status: ord.status || 'placed',
      deliveryType: ord.deliveryType || 'standard',
      createdAt: ord.createdAt,
    }))

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrdersCount,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        activeCoupons,
        activeBanners,
        deliveryBreakdown: {
          sameDay: sameDayDeliveries,
          scheduled: scheduledDeliveries,
          standard: standardDeliveries,
        },
        recentOrders,
      },
    })
  } catch (error: any) {
    req.payload.logger.error(`Analytics Endpoint Error: ${error.message}`)
    return res.status(500).json({ error: 'Failed to compute admin analytics' })
  }
}
