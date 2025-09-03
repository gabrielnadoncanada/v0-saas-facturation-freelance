import { db } from '../db'
import { payments } from '../schema'
import type { Payment, NewPayment } from '../types'

export class PaymentQueries {
  // Create a new payment
  static async create(data: NewPayment): Promise<Payment> {
    const result = await db.insert(payments).values(data).returning()
    return result[0]
  }
}

