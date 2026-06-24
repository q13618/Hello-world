import { handleUpload } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(request) {
  const body = await request.json()

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getSession()
        if (!session) {
          throw new Error('Unauthorized')
        }
        return {
          addRandomSuffix: true,
          allowedContentTypes: ['image/*', 'video/*'],
          maximumSizeInBytes: 100 * 1024 * 1024,
        }
      },
      onUploadCompleted: async () => {
        // Post metadata is saved separately via /api/posts
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 },
    )
  }
}
