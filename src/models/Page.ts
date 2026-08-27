import { Schema, model, models } from 'mongoose'

const PageSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  layout: Schema.Types.Mixed, // content blocks, kept loose
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true })

export default models.Page || model('Page', PageSchema)
