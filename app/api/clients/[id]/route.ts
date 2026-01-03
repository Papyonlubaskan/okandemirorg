import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

/**
 * Single Client Management
 * GET /api/clients/[id] - Müşteri detayları
 * PUT /api/clients/[id] - Müşteri güncelle
 * DELETE /api/clients/[id] - Müşteri sil
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id

    // Müşteri bilgileri
    const [client] = await query(`
      SELECT * FROM clients WHERE id = ?
    `, [clientId])

    if (!client) {
      return NextResponse.json({
        success: false,
        error: 'Müşteri bulunamadı'
      }, { status: 404 })
    }

    // Son 30 gün metrikleri
    const metrics = await query(`
      SELECT 
        date,
        platform,
        SUM(spend) as daily_spend,
        SUM(conversions) as daily_conversions,
        AVG(roas) as daily_roas,
        AVG(cpa) as daily_cpa,
        SUM(clicks) as daily_clicks,
        SUM(impressions) as daily_impressions
      FROM client_campaign_metrics
      WHERE client_id = ? 
        AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY date, platform
      ORDER BY date DESC
    `, [clientId])

    // Aktif kampanyalar
    const campaigns = await query(`
      SELECT 
        ccm.campaign_id,
        ccm.campaign_name,
        ccm.platform,
        ccm.campaign_status,
        SUM(ccm.spend) as total_spend,
        SUM(ccm.conversions) as total_conversions,
        AVG(ccm.roas) as avg_roas,
        AVG(ccm.cpa) as avg_cpa,
        MAX(ccm.date) as last_update
      FROM client_campaign_metrics ccm
      WHERE ccm.client_id = ?
        AND ccm.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY ccm.campaign_id, ccm.campaign_name, ccm.platform, ccm.campaign_status
      ORDER BY total_spend DESC
    `, [clientId])

    // Son eventler
    const recentEvents = await query(`
      SELECT * FROM client_events
      WHERE client_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `, [clientId])

    // Bu ayki fatura bilgisi
    const [currentInvoice] = await query(`
      SELECT * FROM client_invoices
      WHERE client_id = ?
        AND period_start <= CURDATE()
        AND period_end >= CURDATE()
      ORDER BY created_at DESC
      LIMIT 1
    `, [clientId])

    // Özet istatistikler
    const [summary] = await query(`
      SELECT 
        SUM(CASE WHEN date = CURDATE() THEN spend ELSE 0 END) as today_spend,
        SUM(CASE WHEN date = CURDATE() THEN conversions ELSE 0 END) as today_conversions,
        SUM(CASE WHEN MONTH(date) = MONTH(CURDATE()) THEN spend ELSE 0 END) as month_spend,
        SUM(CASE WHEN MONTH(date) = MONTH(CURDATE()) THEN conversions ELSE 0 END) as month_conversions,
        AVG(CASE WHEN date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN roas ELSE NULL END) as week_avg_roas
      FROM client_campaign_metrics
      WHERE client_id = ?
    `, [clientId])

    return NextResponse.json({
      success: true,
      client,
      metrics,
      campaigns,
      recentEvents,
      currentInvoice: currentInvoice || null,
      summary: summary || {}
    })

  } catch (error) {
    console.error('Get client error:', error)
    return NextResponse.json({
      success: false,
      error: 'Müşteri bilgileri getirilemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    const data = await request.json()

    // Müşteri var mı kontrol et
    const [existing] = await query('SELECT id FROM clients WHERE id = ?', [clientId])
    
    if (!existing) {
      return NextResponse.json({
        success: false,
        error: 'Müşteri bulunamadı'
      }, { status: 404 })
    }

    // Güncellenebilir alanlar
    const updates: string[] = []
    const values: any[] = []

    const updatableFields = [
      'name', 'email', 'phone', 'company_name', 'tax_number', 'tax_office', 'address',
      'package_type', 'monthly_fee', 'management_fee_percent',
      'google_ads_customer_id', 'google_ads_enabled',
      'meta_ad_account_id', 'meta_ads_enabled',
      'daily_budget_limit', 'monthly_budget_limit',
      'target_roas', 'target_cpa',
      'alert_email', 'alert_phone', 'alert_whatsapp',
      'report_frequency', 'report_day',
      'status', 'notes'
    ]

    updatableFields.forEach(field => {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`)
        values.push(data[field])
      }
    })

    if (updates.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Güncellenecek alan bulunamadı'
      }, { status: 400 })
    }

    values.push(clientId)

    await query(`
      UPDATE clients 
      SET ${updates.join(', ')}
      WHERE id = ?
    `, values)

    // Event oluştur
    await query(`
      INSERT INTO client_events 
      (client_id, event_type, severity, title, description, metadata)
      VALUES (?, 'other', 'info', 'Müşteri Bilgileri Güncellendi', 
              'Müşteri bilgileri güncellendi', ?)
    `, [clientId, JSON.stringify({ updated_fields: Object.keys(data) })])

    return NextResponse.json({
      success: true,
      message: 'Müşteri başarıyla güncellendi'
    })

  } catch (error) {
    console.error('Update client error:', error)
    return NextResponse.json({
      success: false,
      error: 'Müşteri güncellenemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id

    // Soft delete (status = cancelled)
    await query(`
      UPDATE clients 
      SET status = 'cancelled', cancelled_at = NOW()
      WHERE id = ?
    `, [clientId])

    // Event oluştur
    await query(`
      INSERT INTO client_events 
      (client_id, event_type, severity, title, description)
      VALUES (?, 'other', 'warning', 'Müşteri İptal Edildi', 'Müşteri hesabı iptal edildi')
    `, [clientId])

    return NextResponse.json({
      success: true,
      message: 'Müşteri başarıyla silindi'
    })

  } catch (error) {
    console.error('Delete client error:', error)
    return NextResponse.json({
      success: false,
      error: 'Müşteri silinemedi',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

