import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { uploadMedia } from '@/lib/storage'

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const url = await uploadMedia(buffer, filename, file.type)
  return NextResponse.json({ url })
}
