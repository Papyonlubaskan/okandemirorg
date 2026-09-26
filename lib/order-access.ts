import pool from '@/lib/mysql'

export type PaidOrder = {
  order_code: string
  access_token: string
  product_slug: string
  product_name: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  status: string
  notes: string | null
}

export async function getPaidOrderByToken(
  token: string,
  expectedSlug?: string
): Promise<PaidOrder | null> {
  const t = String(token || '').trim()
  if (t.length < 16) return null

  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.execute(
      `SELECT order_code, access_token, product_slug, product_name,
              customer_name, customer_email, customer_phone, status, notes
       FROM digital_orders WHERE access_token = ? LIMIT 1`,
      [t]
    )
    const order = (rows as PaidOrder[])[0]
    if (!order || order.status !== 'paid') return null
    if (expectedSlug && order.product_slug !== expectedSlug) return null
    return order
  } finally {
    connection.release()
  }
}

export async function appendOrderNote(orderCode: string, note: string) {
  const connection = await pool.getConnection()
  try {
    await connection.execute(
      `UPDATE digital_orders
       SET notes = CONCAT(COALESCE(notes, ''), '\n', ?)
       WHERE order_code = ?`,
      [note.slice(0, 2000), orderCode]
    )
  } finally {
    connection.release()
  }
}
