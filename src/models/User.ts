import { Schema, model, models, Types } from 'mongoose'

const AddressSchema = new Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false },
}, { _id: false })

const CartItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: 'Product' },
  quantity: Number,
}, { _id: false })

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash
  phone: String,
  roles: { type: [String], default: ['customer'] },
  addresses: [AddressSchema],
  ordersCount: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  purchases: [{ type: Types.ObjectId, ref: 'Product' }],
  cart: { items: [CartItemSchema] },
}, { timestamps: true })

export default models.User || model('User', UserSchema)
