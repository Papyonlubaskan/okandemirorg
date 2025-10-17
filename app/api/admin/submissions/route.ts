import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // TODO: Add authentication check here
    // const session = await getSession(request)
    // if (!session || session.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to last 100
    })

    return NextResponse.json({
      success: true,
      submissions,
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, notes, assignedTo } = await request.json()

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: {
        status,
        notes,
        assignedTo,
      },
    })

    return NextResponse.json({
      success: true,
      submission: updated,
    })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

