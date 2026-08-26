import dotenv from 'dotenv'
import path from 'path'
import payload from 'payload'
import { seed } from './index'

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
})

const run = async () => {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'DEFAULT_SECRET',
      local: true,
    })

    payload.logger.info('Executing boutique payload seed script...')
    await seed(payload)
    payload.logger.info('SUCCESS: All 14 customer products, categories, coupons, banners, notifications & orders seeded!')
    process.exit(0)
  } catch (err) {
    console.error('ERROR SEEDING DATABASE:', err)
    process.exit(1)
  }
}

run()
