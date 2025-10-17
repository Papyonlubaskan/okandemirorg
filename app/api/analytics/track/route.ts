import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { eventType, page, sessionId, userId, eventData } = await request.json()
    
    // Get request metadata
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    
    // Save analytics event
    await prisma.aIAnalyticsLog.create({
      data: {
        eventType,
        page,
        sessionId,
        userId: userId || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        eventData: eventData ? JSON.stringify(eventData) : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    )
  }
}

