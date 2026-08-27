import { Schema, model, models, Types } from 'mongoose'

const NotificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },
  message: { type: String, required: true },
  description: String,
  actionUrl: String,
  actionLabel: String,
  relatedOrder: { type: Types.ObjectId, ref: 'Order' },
  isRead: { type: Boolean, default: false },
  readAt: Date,
}, { timestamps: { createdAt: true, updatedAt: false } })

export default models.Notification || model('Notification', NotificationSchema)
