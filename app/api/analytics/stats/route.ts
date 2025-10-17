import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Page views
    const [
      pageViews24h,
      pageViews7d,
      pageViews30d,
      uniqueVisitors24h,
      topPages,
      eventsByType,
    ] = await Promise.all([
      // Page views last 24 hours
      prisma.aIAnalyticsLog.count({
        where: {
          eventType: 'page_view',
          createdAt: { gte: last24Hours },
        },
      }),
      
      // Page views last 7 days
      prisma.aIAnalyticsLog.count({
        where: {
          eventType: 'page_view',
          createdAt: { gte: last7Days },
        },
      }),
      
      // Page views last 30 days
      prisma.aIAnalyticsLog.count({
        where: {
          eventType: 'page_view',
          createdAt: { gte: last30Days },
        },
      }),
      
      // Unique visitors last 24 hours
      prisma.aIAnalyticsLog.groupBy({
        by: ['sessionId'],
        where: {
          eventType: 'page_view',
          createdAt: { gte: last24Hours },
        },
      }),
      
      // Top pages
      prisma.aIAnalyticsLog.groupBy({
        by: ['page'],
        where: {
          eventType: 'page_view',
          createdAt: { gte: last7Days },
        },
        _count: {
          page: true,
        },
        orderBy: {
          _count: {
            page: 'desc',
          },
        },
        take: 10,
      }),
      
      // Events by type
      prisma.aIAnalyticsLog.groupBy({
        by: ['eventType'],
        where: {
          createdAt: { gte: last24Hours },
        },
        _count: {
          eventType: true,
        },
      }),
    ])

    // Calculate average time on site
    const sessions = await prisma.aIAnalyticsLog.findMany({
      where: {
        eventType: 'page_view',
        createdAt: { gte: last24Hours },
      },
      select: {
        sessionId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const sessionTimes = new Map<string, { first: Date; last: Date }>()
    sessions.forEach((session) => {
      const existing = sessionTimes.get(session.sessionId)
      if (!existing) {
        sessionTimes.set(session.sessionId, {
          first: session.createdAt,
          last: session.createdAt,
        })
      } else {
        existing.last = session.createdAt
      }
    })

    let totalTime = 0
    sessionTimes.forEach((time) => {
      totalTime += time.last.getTime() - time.first.getTime()
    })
    const avgTimeOnSite = sessionTimes.size > 0 ? totalTime / sessionTimes.size / 1000 : 0

    // Get contact submissions
    const [submissions24h, submissions7d, submissions30d] = await Promise.all([
      prisma.contactSubmission.count({
        where: { createdAt: { gte: last24Hours } },
      }),
      prisma.contactSubmission.count({
        where: { createdAt: { gte: last7Days } },
      }),
      prisma.contactSubmission.count({
        where: { createdAt: { gte: last30Days } },
      }),
    ])

    // Calculate conversion rate
    const conversionRate = pageViews24h > 0 ? (submissions24h / pageViews24h) * 100 : 0

    return NextResponse.json({
      success: true,
      stats: {
        pageViews: {
          last24Hours: pageViews24h,
          last7Days: pageViews7d,
          last30Days: pageViews30d,
        },
        uniqueVisitors: {
          last24Hours: uniqueVisitors24h.length,
        },
        avgTimeOnSite: Math.round(avgTimeOnSite),
        submissions: {
          last24Hours: submissions24h,
          last7Days: submissions7d,
          last30Days: submissions30d,
        },
        conversionRate: conversionRate.toFixed(2),
        topPages: topPages.map((p) => ({
          page: p.page,
          views: p._count.page,
        })),
        eventsByType: eventsByType.map((e) => ({
          type: e.eventType,
          count: e._count.eventType,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching analytics stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

