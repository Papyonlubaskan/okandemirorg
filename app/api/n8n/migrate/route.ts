import { NextResponse } from 'next/server'
import { createTables, testConnection } from '@/lib/mysql'

/**
 * n8n Database Migration API
 * N8N için gerekli tabloları oluşturur
 */

export async function POST() {
  try {
    // Bağlantıyı test et
    const isConnected = await testConnection()
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        error: 'MySQL bağlantısı başarısız'
      }, { status: 500 })
    }

    // Tabloları oluştur
    const result = await createTables()
    
    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Tablolar oluşturulamadı'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'N8N tabloları başarıyla oluşturuldu',
      tables: [
        'campaign_metrics',
        'audience_performance',
        'n8n_workflow_logs'
      ]
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Migration hatası',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * GET - Migration durumunu kontrol et
 */
export async function GET() {
  try {
    const isConnected = await testConnection()
    
    if (!isConnected) {
      return NextResponse.json({
        success: false,
        configured: false,
        error: 'MySQL bağlantısı yok'
      })
    }

    // Tabloların varlığını kontrol et
    const { query } = await import('@/lib/mysql')
    
    const tables = await query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('campaign_metrics', 'audience_performance', 'n8n_workflow_logs')
    `, [process.env.MYSQL_DATABASE]) as Array<{ TABLE_NAME: string }>

    return NextResponse.json({
      success: true,
      configured: true,
      tables_created: tables.length,
      tables: tables.map(t => t.TABLE_NAME),
      required_tables: ['campaign_metrics', 'audience_performance', 'n8n_workflow_logs']
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}



