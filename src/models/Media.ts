import { Schema, model, models } from 'mongoose'

const MediaSchema = new Schema({
  url: { type: String, required: true },          // Cloudinary secure_url
  cloudinaryId: { type: String, required: true },  // Cloudinary public_id
  alt: { type: String, required: true },
  caption: String,
  width: Number,
  height: Number,
}, { timestamps: { createdAt: true, updatedAt: false } })

export default models.Media || model('Media', MediaSchema)
