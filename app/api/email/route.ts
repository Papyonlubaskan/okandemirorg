import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'
import { analyzeCustomerMessage } from '@/lib/ai-analysis'

const prisma = new PrismaClient()

// Email konfigürasyonu - cPanel ayarlarına göre
const transporter = nodemailer.createTransport({
  host: 'okandemir.org',
  port: 465,
  secure: true, // SSL/TLS kullan
  auth: {
    user: 'info@okandemir.org',
    pass: process.env.EMAIL_PASSWORD, // .env dosyasından alınacak
  },
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message, company } = await request.json()

    // AI Analysis
    const analysis = await analyzeCustomerMessage(name, email, company, message)
    
    // Get request metadata
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    const referrer = request.headers.get('referer')
    
    // Save to database with AI insights
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        message,
        source: 'contact_form',
        
        // AI Analysis Results
        aiCategory: analysis.category,
        aiSentiment: analysis.sentiment,
        aiPriority: analysis.priority,
        aiEstimatedBudget: analysis.estimatedBudget,
        aiKeywords: JSON.stringify(analysis.keywords),
        aiSummary: analysis.summary,
        aiConfidence: analysis.confidence,
        
        // Metadata
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        referrer: referrer || null,
      },
    })

    // Prepare email with AI insights
    const categoryLabels: Record<string, string> = {
      web_design: 'Web Tasarım',
      digital_marketing: 'Dijital Pazarlama',
      seo: 'SEO',
      development: 'Yazılım Geliştirme',
      branding: 'Marka Kimliği',
      digital_transformation: 'Dijital Dönüşüm',
      consultancy: 'Danışmanlık',
      general: 'Genel',
    }
    
    const priorityLabels = {
      high: '🔴 Yüksek',
      medium: '🟡 Orta',
      low: '🟢 Düşük',
    }
    
    const sentimentLabels = {
      positive: '😊 Pozitif',
      neutral: '😐 Nötr',
      negative: '😞 Negatif',
    }
    
    const budgetLabels = {
      low: '💰 Düşük',
      medium: '💰💰 Orta',
      high: '💰💰💰 Yüksek',
      enterprise: '💰💰💰💰 Kurumsal',
    }

    // Send email with AI insights
    const info = await transporter.sendMail({
      from: 'info@okandemir.org',
      to: 'info@okandemir.org',
      replyTo: email,
      subject: `${priorityLabels[analysis.priority]} İletişim Formu: ${subject || 'Yeni Mesaj'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
            🤖 AI Analizi ile Yeni İletişim Mesajı
          </h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">📊 AI Analiz Sonuçları</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Kategori:</td>
                <td style="padding: 8px;">${categoryLabels[analysis.category] || analysis.category}</td>
              </tr>
              <tr style="background: #fff;">
                <td style="padding: 8px; font-weight: bold;">Öncelik:</td>
                <td style="padding: 8px;">${priorityLabels[analysis.priority]}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Duygu:</td>
                <td style="padding: 8px;">${sentimentLabels[analysis.sentiment]}</td>
              </tr>
              <tr style="background: #fff;">
                <td style="padding: 8px; font-weight: bold;">Tahmini Bütçe:</td>
                <td style="padding: 8px;">${budgetLabels[analysis.estimatedBudget]}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Güven Skoru:</td>
                <td style="padding: 8px;">${(analysis.confidence * 100).toFixed(0)}%</td>
              </tr>
            </table>
            
            ${analysis.keywords.length > 0 ? `
              <div style="margin-top: 15px;">
                <strong>Anahtar Kelimeler:</strong><br>
                ${analysis.keywords.map(k => `<span style="background: #2563eb; color: white; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block; font-size: 12px;">${k}</span>`).join('')}
              </div>
            ` : ''}
            
            <div style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 4px;">
              <strong>AI Özet:</strong><br>
              <em>${analysis.summary}</em>
            </div>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">👤 Müşteri Bilgileri</h3>
            <p><strong>Ad:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Telefon:</strong> ${phone || 'Belirtilmedi'}</p>
            ${company ? `<p><strong>Şirket:</strong> ${company}</p>` : ''}
            <p><strong>Konu:</strong> ${subject || 'Belirtilmedi'}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #1f2937; margin-top: 0;">💬 Mesaj İçeriği</h3>
            <p style="line-height: 1.6; color: #374151;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 8px; font-size: 12px; color: #1e40af;">
            <strong>📌 Not:</strong> Bu mesaj AI analiz sistemi tarafından otomatik olarak kategorize edilmiştir. 
            Submission ID: ${submission.id}
          </div>
        </div>
      `,
    })

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      submissionId: submission.id,
      analysis: {
        category: analysis.category,
        priority: analysis.priority,
        sentiment: analysis.sentiment,
      }
    })
  } catch (error) {
    console.error('Email gönderme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Email gönderilemedi' },
      { status: 500 }
    )
  }
}
