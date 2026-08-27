import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongoose'
import Coupon from '@/models/Coupon'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const code = body.code
    const totalAmount = Number(body.cartTotal)

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code is required.' }, { status: 400 })
    }

    await dbConnect()

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid coupon code.' }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, message: 'This coupon is no longer active.' }, { status: 400 })
    }

    const now = new Date()
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return NextResponse.json({ success: false, message: 'This coupon is not valid yet.' }, { status: 400 })
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return NextResponse.json({ success: false, message: 'This coupon has expired.' }, { status: 400 })
    }

    if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, message: 'Coupon usage limit reached.' }, { status: 400 })
    }

    if (totalAmount && coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        { success: false, message: `Minimum order amount of ₹${coupon.minOrderAmount} required.` },
        { status: 400 },
      )
    }

    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = (totalAmount * coupon.value) / 100
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.value
    } else if (coupon.discountType === 'freeShipping') {
      discountAmount = 0
    }

    return NextResponse.json({
      success: true,
      valid: true,
      discountAmount,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
      message: 'Coupon applied successfully!',
    })
  } catch (err) {
    console.error('[coupons/validate]', err)
    return NextResponse.json({ success: false, message: 'Server error validating coupon.' }, { status: 500 })
  }
}
