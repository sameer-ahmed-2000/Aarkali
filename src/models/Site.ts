import { Schema, model, models, Types } from 'mongoose'

const SiteSettingsSchema = new Schema({ productsPage: { type: Types.ObjectId, ref: 'Page' } })
const SiteHeaderSchema = new Schema({ data: Schema.Types.Mixed })
const SiteFooterSchema = new Schema({ data: Schema.Types.Mixed })

export const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema)
export const SiteHeader = models.SiteHeader || model('SiteHeader', SiteHeaderSchema)
export const SiteFooter = models.SiteFooter || model('SiteFooter', SiteFooterSchema)
