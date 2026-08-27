import { Schema, model, models, Types } from 'mongoose'

const CategorySchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  media: { type: Types.ObjectId, ref: 'Media' },
  isFeatured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
})

export default models.Category || model('Category', CategorySchema)
