import { getSession } from '@/lib/auth'
import { getPosts } from '@/lib/storage'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteButton from './DeleteButton'

export default async function Dashboard() {
  const session = await getSession()
  if (!session) redirect('/admin')

  const posts = await getPosts()
  const sorted = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
              ← 前台
            </Link>
            <h1 className="text-xl font-bold text-gray-900">📊 管理后台</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + 发布新内容
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                退出
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            全部内容 <span className="text-gray-400 font-normal text-base">({sorted.length} 篇)</span>
          </h2>
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>还没有内容，快去发布第一篇吧！</p>
            <Link
              href="/admin/new"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + 发布内容
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/post/${post.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        target="_blank"
                      >
                        {post.title}
                      </Link>
                      {post.content && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{post.content}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        post.type === 'photo' ? 'bg-blue-100 text-blue-700' :
                        post.type === 'video' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {post.type === 'photo' ? '📷 图片' : post.type === 'video' ? '🎬 视频' : '📝 文字'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteButton postId={post.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
