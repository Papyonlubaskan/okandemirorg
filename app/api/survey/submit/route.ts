import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const {
      customerName,
      customerEmail,
      overallRating,
      communicationRating,
      qualityRating,
      timelinessRating,
      valueRating,
      whatWorkedWell,
      whatCouldImprove,
      wouldRecommend,
      testimonial,
      allowPublic,
      token,
    } = data

    // Validation
    if (!customerName || !customerEmail || !overallRating) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')

    // Create survey
    const survey = await prisma.survey.create({
      data: {
        customerName,
        customerEmail,
        overallRating: parseInt(overallRating),
        communicationRating: parseInt(communicationRating) || 0,
        qualityRating: parseInt(qualityRating) || 0,
        timelinessRating: parseInt(timelinessRating) || 0,
        valueRating: parseInt(valueRating) || 0,
        whatWorkedWell: whatWorkedWell || null,
        whatCouldImprove: whatCouldImprove || null,
        wouldRecommend: Boolean(wouldRecommend),
        testimonial: testimonial || null,
        allowPublic: Boolean(allowPublic),
        ipAddress: ipAddress || null,
      },
    })

    // If token provided, update invitation
    if (token) {
      await prisma.surveyInvitation.updateMany({
        where: { token },
        data: { completedAt: new Date() },
      })
    }

    return NextResponse.json({
      success: true,
      surveyId: survey.id,
    })
  } catch (error) {
    console.error('Survey submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Anket gönderilemedi' },
      { status: 500 }
    )
  }
}

