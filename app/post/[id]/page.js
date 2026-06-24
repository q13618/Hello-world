import Link from 'next/link'
import { getPosts } from '@/lib/storage'
import { notFound } from 'next/navigation'

export default async function PostPage({ params }) {
  const posts = await getPosts()
  const post = posts.find((p) => p.id === params.id)
  if (!post) notFound()

  const date = new Date(post.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
            ← 返回
          </Link>
          <h1 className="text-xl font-bold text-gray-900">✍️ My Blog</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              post.type === 'photo' ? 'bg-blue-100 text-blue-700' :
              post.type === 'video' ? 'bg-purple-100 text-purple-700' :
              'bg-green-100 text-green-700'
            }`}>
              {post.type === 'photo' ? '📷 图片' : post.type === 'video' ? '🎬 视频' : '📝 文字'}
            </span>
            <time className="text-sm text-gray-400">{date}</time>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

          {post.type === 'photo' && post.mediaUrl && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={post.mediaUrl}
                alt={post.title}
                className="w-full object-contain max-h-[600px]"
              />
            </div>
          )}

          {post.type === 'video' && post.mediaUrl && (
            <div className="mb-6 rounded-xl overflow-hidden bg-black">
              <video
                src={post.mediaUrl}
                controls
                className="w-full max-h-[500px]"
              />
            </div>
          )}

          {post.content && (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {post.content}
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
