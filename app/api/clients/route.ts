import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

/**
 * Multi-Client Management API
 * Müşteri yönetim sistemi
 */

// GET /api/clients - Tüm müşterileri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const package_type = searchParams.get('package')

    let sql = `
      SELECT 
        c.*,
        COUNT(DISTINCT ccm.campaign_id) as total_campaigns,
        SUM(CASE WHEN ccm.date = CURDATE() THEN ccm.spend ELSE 0 END) as today_spend,
        SUM(CASE WHEN ccm.date = CURDATE() THEN ccm.conversions ELSE 0 END) as today_conversions,
        AVG(CASE WHEN ccm.date = CURDATE() THEN ccm.roas ELSE NULL END) as today_roas,
        SUM(CASE WHEN MONTH(ccm.date) = MONTH(CURDATE()) THEN ccm.spend ELSE 0 END) as month_spend,
        ROUND((SUM(CASE WHEN MONTH(ccm.date) = MONTH(CURDATE()) THEN ccm.spend ELSE 0 END) / c.monthly_budget_limit * 100), 2) as budget_usage_percent
      FROM clients c
      LEFT JOIN client_campaign_metrics ccm ON c.id = ccm.client_id 
        AND ccm.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      WHERE c.status = ?
    `

    const params: any[] = [status]

    if (package_type) {
      sql += ' AND c.package_type = ?'
      params.push(package_type)
    }

    sql += ' GROUP BY c.id ORDER BY c.name'

    const clients = await query(sql, params)

    // Genel istatistikler
    const [stats] = await query(`
      SELECT 
        COUNT(*) as total_clients,
        SUM(monthly_fee + (monthly_budget_limit * management_fee_percent / 100)) as estimated_monthly_revenue,
        SUM(monthly_budget_limit) as total_monthly_budget
      FROM clients
      WHERE status = 'active'
    `)

    return NextResponse.json({
      success: true,
      clients,
      stats: stats || {
        total_clients: 0,
        estimated_monthly_revenue: 0,
        total_monthly_budget: 0
      }
    })

  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json({
      success: false,
      error: 'Müşteriler getirilemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/clients - Yeni müşteri ekle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validation
    if (!data.name || !data.email) {
      return NextResponse.json({
        success: false,
        error: 'İsim ve email gerekli'
      }, { status: 400 })
    }

    // Email kontrolü
    const existingClient = await query(
      'SELECT id FROM clients WHERE email = ?',
      [data.email]
    )

    if (existingClient.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Bu email adresi zaten kayıtlı'
      }, { status: 400 })
    }

    // Portal token oluştur
    const portalToken = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Müşteri ekle
    const result = await query(`
      INSERT INTO clients 
      (name, email, phone, company_name, tax_number, tax_office, address,
       package_type, monthly_fee, management_fee_percent, setup_fee,
       google_ads_customer_id, google_ads_enabled,
       meta_ad_account_id, meta_ads_enabled,
       daily_budget_limit, monthly_budget_limit,
       target_roas, target_cpa,
       alert_email, alert_phone, alert_whatsapp,
       report_frequency, report_day,
       portal_token, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.name,
      data.email,
      data.phone || null,
      data.company_name || null,
      data.tax_number || null,
      data.tax_office || null,
      data.address || null,
      data.package_type || 'standard',
      data.monthly_fee || 4500,
      data.management_fee_percent || 15,
      data.setup_fee || 0,
      data.google_ads_customer_id || null,
      data.google_ads_enabled || false,
      data.meta_ad_account_id || null,
      data.meta_ads_enabled || false,
      data.daily_budget_limit || null,
      data.monthly_budget_limit || null,
      data.target_roas || 3.00,
      data.target_cpa || null,
      data.alert_email || data.email,
      data.alert_phone || data.phone,
      data.alert_whatsapp || data.phone,
      data.report_frequency || 'weekly',
      data.report_day || 'Monday',
      portalToken,
      'pending'
    ])

    const clientId = result.insertId

    // Event oluştur
    await query(`
      INSERT INTO client_events 
      (client_id, event_type, severity, title, description)
      VALUES (?, 'other', 'info', 'Yeni Müşteri Eklendi', 'Müşteri sisteme eklendi, onboarding süreci başlatılabilir')
    `, [clientId])

    // n8n'e onboarding workflow tetikle
    if (process.env.N8N_WEBHOOK_URL) {
      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'client_onboarding',
          clientId,
          clientData: {
            name: data.name,
            email: data.email,
            company_name: data.company_name,
            package_type: data.package_type,
            portal_url: `https://okandemir.org/portal/${portalToken}`
          }
        })
      }).catch(err => console.error('n8n webhook error:', err))
    }

    return NextResponse.json({
      success: true,
      clientId,
      portalToken,
      portalUrl: `https://okandemir.org/portal/${portalToken}`,
      message: 'Müşteri başarıyla eklendi'
    }, { status: 201 })

  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json({
      success: false,
      error: 'Müşteri eklenemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

