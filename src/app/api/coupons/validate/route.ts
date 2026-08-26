import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal, userId } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Coupon code is required.' }, { status: 400 })
    }

    // Fetch coupon from Payload
    const res = await fetch(
      `${PAYLOAD_URL}/api/coupons?where[code][equals]=${encodeURIComponent(code.toUpperCase().trim())}&limit=1`,
      { cache: 'no-store' },
    )

    if (!res.ok) {
      return NextResponse.json({ valid: false, message: 'Unable to validate coupon.' }, { status: 500 })
    }

    const data = await res.json()
    const coupon = data?.docs?.[0]

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code.' }, { status: 404 })
    }

    // Check active status
    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: 'This coupon is no longer active.' }, { status: 400 })
    }

    // Check validity dates
    const now = new Date()
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return NextResponse.json({ valid: false, message: 'This coupon is not yet valid.' }, { status: 400 })
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired.' }, { status: 400 })
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, message: 'This coupon has reached its usage limit.' }, { status: 400 })
    }

    // Check minimum order amount
    const minOrder = coupon.minOrderAmount || 0
    if (cartTotal < minOrder) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum order amount of ₹${minOrder.toLocaleString('en-IN')} required for this coupon.`,
        },
        { status: 400 },
      )
    }

    // Calculate discount amount
    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.value) / 100
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount)
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.value, cartTotal)
    } else if (coupon.discountType === 'freeShipping') {
      discountAmount = 0 // Handled separately
    }

    discountAmount = Math.round(discountAmount * 100) / 100

    return NextResponse.json(
      {
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          value: coupon.value,
          description: coupon.description,
        },
        discountAmount,
        message:
          coupon.discountType === 'freeShipping'
            ? 'Free shipping applied to your order'
            : `Coupon applied successfully! You save ₹${discountAmount.toLocaleString('en-IN')}`,
      },
      { status: 200 },
    )
  } catch (err) {
    console.error('[coupon-validate]', err)
    return NextResponse.json({ valid: false, message: 'Server error. Please try again.' }, { status: 500 })
  }
}
