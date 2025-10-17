import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'
import { isValidEmail } from '@/lib/formValidation'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      )
    }

    // Save to database
    const connection = await pool.getConnection()
    
    try {
      // Check if email already exists
      const [existing] = await connection.execute(
        'SELECT id FROM newsletter_subscribers WHERE email = ?',
        [email]
      )

      if (Array.isArray(existing) && existing.length > 0) {
        connection.release()
        return NextResponse.json(
          { success: false, error: 'Bu e-posta adresi zaten kayıtlı' },
          { status: 400 }
        )
      }

      // Create table if not exists
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE
        )
      `)

      // Insert new subscriber
      await connection.execute(
        'INSERT INTO newsletter_subscribers (email) VALUES (?)',
        [email]
      )

      connection.release()

      // TODO: Integrate with Mailchimp/SendGrid here
      // Example: await sendToMailchimp(email)

      return NextResponse.json({
        success: true,
        message: 'Aboneliğiniz başarıyla oluşturuldu!',
      })
    } catch (error) {
      connection.release()
      throw error
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Newsletter subscription error:', error)
    }
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz e-posta adresi' },
        { status: 400 }
      )
    }

    const connection = await pool.getConnection()
    
    await connection.execute(
      'UPDATE newsletter_subscribers SET is_active = FALSE WHERE email = ?',
      [email]
    )
    
    connection.release()

    return NextResponse.json({
      success: true,
      message: 'Aboneliğiniz iptal edildi.',
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Newsletter unsubscribe error:', error)
    }
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu.' },
      { status: 500 }
    )
  }
}

