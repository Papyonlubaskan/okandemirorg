import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const surveys = await prisma.survey.findMany({
      orderBy: { completedAt: 'desc' },
      take: 100,
    })

    // Calculate statistics
    const stats = {
      total: surveys.length,
      averageOverallRating: surveys.reduce((acc, s) => acc + s.overallRating, 0) / surveys.length || 0,
      averageCommunicationRating: surveys.reduce((acc, s) => acc + s.communicationRating, 0) / surveys.length || 0,
      averageQualityRating: surveys.reduce((acc, s) => acc + s.qualityRating, 0) / surveys.length || 0,
      averageTimelinessRating: surveys.reduce((acc, s) => acc + s.timelinessRating, 0) / surveys.length || 0,
      averageValueRating: surveys.reduce((acc, s) => acc + s.valueRating, 0) / surveys.length || 0,
      recommendationRate: (surveys.filter(s => s.wouldRecommend).length / surveys.length) * 100 || 0,
      ratingDistribution: {
        5: surveys.filter(s => s.overallRating === 5).length,
        4: surveys.filter(s => s.overallRating === 4).length,
        3: surveys.filter(s => s.overallRating === 3).length,
        2: surveys.filter(s => s.overallRating === 2).length,
        1: surveys.filter(s => s.overallRating === 1).length,
      },
    }

    return NextResponse.json({
      success: true,
      surveys,
      stats,
    })
  } catch (error) {
    console.error('Error fetching survey results:', error)
    return NextResponse.json(
      { success: false, error: 'Anket sonuçları alınamadı' },
      { status: 500 }
    )
  }
}

