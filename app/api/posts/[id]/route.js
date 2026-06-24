import { NextResponse } from 'next/server'
import { getPosts, savePosts } from '@/lib/storage'
import { getSession } from '@/lib/auth'

export async function GET(req, { params }) {
  const posts = await getPosts()
  const post = posts.find((p) => p.id === params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function DELETE(req, { params }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const posts = await getPosts()
  const filtered = posts.filter((p) => p.id !== params.id)
  await savePosts(filtered)

  return NextResponse.json({ ok: true })
}
