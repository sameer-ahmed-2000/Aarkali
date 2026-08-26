import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      items,
      total,
      paymentMethod = 'cod',
      paymentStatus = 'pending',
      deliveryAddress,
      deliverySchedule = 'standard',
      couponApplied,
      discountAmount = 0,
      userId,
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart items are required to create an order.' },
        { status: 400 },
      )
    }

    // Generate a unique boutique tracking number
    const trackingId = `TRK${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`

    // Prepare order document for Payload
    const orderData = {
      orderedBy: userId || null,
      total: Math.round(total),
      items: items.map(item => ({
        product: typeof item.product === 'object' ? item.product.id : item.product,
        price: item.price || 0,
        quantity: item.quantity || 1,
      })),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : paymentStatus,
      status: 'placed',
      trackingId,
      courier: 'Blue Dart / Delhivery Express',
      courierTrackingUrl: `https://www.bluedart.com/tracking?track=${trackingId}`,
      deliverySchedule,
      deliveryAddress: deliveryAddress || null,
      couponApplied: couponApplied || null,
      discountAmount: Number(discountAmount) || 0,
    }

    const payloadRes = await fetch(`${PAYLOAD_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.get('cookie') ? { Cookie: req.headers.get('cookie')! } : {}),
      },
      body: JSON.stringify(orderData),
    })

    if (!payloadRes.ok) {
      const errData = await payloadRes.json().catch(() => ({}))
      console.error('[orders/create] Payload error:', errData)
      return NextResponse.json(
        {
          success: false,
          message: errData?.errors?.[0]?.message || 'Failed to record order in database.',
        },
        { status: 500 },
      )
    }

    const createdOrder = await payloadRes.json()

    return NextResponse.json(
      {
        success: true,
        orderId: createdOrder.doc?.id || createdOrder.id,
        trackingId,
        message: 'Order created successfully!',
      },
      { status: 201 },
    )
  } catch (err) {
    console.error('[orders/create]', err)
    return NextResponse.json(
      { success: false, message: 'Server error while creating order.' },
      { status: 500 },
    )
  }
}
