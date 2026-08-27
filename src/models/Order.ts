import { Schema, model, models, Types } from 'mongoose'

const OrderItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  price: Number,
  quantity: Number,
}, { _id: false })

const OrderSchema = new Schema({
  orderedBy: { type: Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String, enum: ['cod', 'razorpay', 'cashfree'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentGatewayOrderId: String,   // Razorpay order_id or Cashfree order_id
  paymentGatewayPaymentId: String, // Razorpay payment_id or Cashfree cf_payment_id
  paymentGatewaySignature: String, // verification only
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed',
  },
  trackingId: String,
  courier: String,
  courierTrackingUrl: String,
  deliveryType: { type: String, enum: ['standard', 'same_day', 'scheduled'], default: 'standard' },
  deliverySchedule: { type: String, enum: ['standard', 'same_day'], default: 'standard' },
  scheduledDate: Date,
  deliverySlot: String,
  deliveryAddress: Schema.Types.Mixed,
  couponApplied: String,
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 },
  items: [OrderItemSchema],
}, { timestamps: true })

export default models.Order || model('Order', OrderSchema)
