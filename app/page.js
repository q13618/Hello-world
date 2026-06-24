import Link from 'next/link'
import { getPosts } from '@/lib/storage'

function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/post/${post.id}`}>
      <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer">
        {post.type === 'photo' && post.mediaUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-56 object-cover"
            />
          </div>
        )}
        {post.type === 'video' && post.mediaUrl && (
          <div className="mb-4 rounded-lg overflow-hidden bg-black">
            <video
              src={post.mediaUrl}
              className="w-full h-56 object-cover"
              muted
              playsInline
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            post.type === 'photo' ? 'bg-blue-100 text-blue-700' :
            post.type === 'video' ? 'bg-purple-100 text-purple-700' :
            'bg-green-100 text-green-700'
          }`}>
            {post.type === 'photo' ? '📷 图片' : post.type === 'video' ? '🎬 视频' : '📝 文字'}
          </span>
          <time className="text-xs text-gray-400">{date}</time>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        {post.content && (
          <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
        )}
      </article>
    </Link>
  )
}

export default async function HomePage() {
  const posts = await getPosts()
  const sorted = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">✍️ My Blog</h1>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            管理后台
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {sorted.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-lg">还没有文章，去后台发布第一篇吧！</p>
            <Link
              href="/admin"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              去后台
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {sorted.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
