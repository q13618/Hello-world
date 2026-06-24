import { put, list, del } from '@vercel/blob'

const DB_KEY = 'blog-db/posts.json'

export async function getPosts() {
  try {
    const { blobs } = await list({ prefix: DB_KEY })
    if (!blobs.length) return []
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    const data = await res.json()
    return Array.isArray(data.posts) ? data.posts : []
  } catch {
    return []
  }
}

export async function savePosts(posts) {
  await put(DB_KEY, JSON.stringify({ posts }), {
    access: 'public',
    addRandomSuffix: false,
  })
}

export async function uploadMedia(buffer, filename, contentType) {
  const blob = await put(`blog-media/${filename}`, buffer, {
    access: 'public',
    contentType,
  })
  return blob.url
}
