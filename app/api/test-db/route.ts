import { NextResponse } from 'next/server'
import { testConnection, createTables } from '@/lib/mysql'

export async function GET() {
  try {
    // Bağlantıyı test et
    const connectionOk = await testConnection()
    
    if (!connectionOk) {
      return NextResponse.json({ 
        success: false, 
        error: 'MySQL bağlantısı başarısız' 
      }, { status: 500 })
    }

    // Tabloları oluştur
    const tablesOk = await createTables()
    
    if (!tablesOk) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tablo oluşturma başarısız' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'MySQL bağlantısı ve tablolar başarılı!' 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Test hatası: ' + error 
    }, { status: 500 })
  }
}
