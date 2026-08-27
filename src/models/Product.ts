import { Schema, model, models, Types } from 'mongoose'
import './Category' // Ensure Category schema is registered

const ProductSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  price: { type: Number, default: 0 },
  categories: [{ type: Types.ObjectId, ref: 'Category' }],
  priceJSON: { type: String },
  paywall: { type: Schema.Types.Mixed },
  layout: { type: [Schema.Types.Mixed] },
  relatedProducts: [{ type: Types.ObjectId, ref: 'Product' }],
  enablePaywall: { type: Boolean, default: false },
}, { timestamps: true })

export default models.Product || model('Product', ProductSchema)
