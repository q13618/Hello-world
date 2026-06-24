import { NextResponse } from 'next/server'
import { getPosts, savePosts } from '@/lib/storage'
import { getSession } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
}

export async function POST(req) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, title, content, mediaUrl } = await req.json()
  if (!title || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const posts = await getPosts()
  const newPost = {
    id: uuidv4(),
    type,
    title,
    content: content || '',
    mediaUrl: mediaUrl || null,
    createdAt: new Date().toISOString(),
  }

  posts.push(newPost)
  await savePosts(posts)

  return NextResponse.json(newPost, { status: 201 })
}
