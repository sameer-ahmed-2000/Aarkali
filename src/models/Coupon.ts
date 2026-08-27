import { Schema, model, models, Types } from 'mongoose'

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed', 'freeShipping'], default: 'percentage' },
  value: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: Number,
  maxUses: Number,
  maxUsesPerUser: { type: Number, default: 1 },
  usageCount: { type: Number, default: 0 },
  startsAt: Date,
  expiresAt: Date,
  applicableCategories: [{ type: Types.ObjectId, ref: 'Category' }],
  applicableProducts: [{ type: Types.ObjectId, ref: 'Product' }],
  firstTimeOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default models.Coupon || model('Coupon', CouponSchema)
