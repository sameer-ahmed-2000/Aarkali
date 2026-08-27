import { Schema, model, models, Types } from 'mongoose'

const BannerSchema = new Schema({
  title: { type: String, required: true },
  subtitle: String,
  position: { type: String, enum: ['hero', 'topBar', 'promo', 'category', 'checkout'], default: 'hero' },
  image: { type: Types.ObjectId, ref: 'Media' },
  mobileImage: { type: Types.ObjectId, ref: 'Media' },
  ctaLabel: String,
  ctaUrl: String,
  backgroundColor: String,
  textColor: { type: String, default: '#ffffff' },
  badgeText: String,
  order: { type: Number, default: 0 },
  startsAt: Date,
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default models.Banner || model('Banner', BannerSchema)
