import { Schema, model, models, Types } from 'mongoose'

const ReviewSchema = new Schema({
  title: { type: String, required: true, maxlength: 100 },
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  customer: { type: Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },
  images: [{ image: { type: Types.ObjectId, ref: 'Media' } }],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote: String,
}, { timestamps: true })

export default models.Review || model('Review', ReviewSchema)
