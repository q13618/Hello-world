'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { upload } from '@vercel/blob/client'
export default function NewPost() {
  const [type, setType] = useState('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setError('请填写标题')
      return
    }
    if ((type === 'photo' || type === 'video') && !file) {
      setError('请选择文件')
      return
    }
    setLoading(true)
    setError('')

    try {
      let mediaUrl = null

      if (file) {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      mediaUrl = blob.url
      }

      const postRes = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title: title.trim(), content: content.trim(), mediaUrl }),
      })

      if (!postRes.ok) throw new Error('发布失败')
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.message || '发布失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
            ← 返回
          </Link>
          <h1 className="text-xl font-bold text-gray-900">发布新内容</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content type selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">内容类型</label>
              <div className="flex gap-3">
                {[
                  { value: 'text', label: '📝 文字', desc: '纯文字文章' },
                  { value: 'photo', label: '📷 图片', desc: '图片 + 说明' },
                  { value: 'video', label: '🎬 视频', desc: '短视频 + 说明' },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => { setType(t.value); setFile(null); setPreview(null) }}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all ${
                      type === t.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{t.label}</div>
                    <div className="text-xs mt-0.5 opacity-70">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入标题..."
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === 'text' ? '正文 *' : '描述（可选）'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={type === 'text' ? '写点什么...' : '添加描述...'}
                rows={type === 'text' ? 8 : 4}
                required={type === 'text'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* File upload */}
            {(type === 'photo' || type === 'video') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {type === 'photo' ? '图片 *' : '视频 *'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  {preview ? (
                    type === 'photo' ? (
                      <img src={preview} alt="预览" className="max-h-48 mx-auto rounded-lg object-contain" />
                    ) : (
                      <video src={preview} controls className="max-h-48 mx-auto rounded-lg" />
                    )
                  ) : (
                    <div className="text-gray-400">
                      <div className="text-3xl mb-2">{type === 'photo' ? '🖼️' : '🎥'}</div>
                      <p className="text-sm">点击选择{type === 'photo' ? '图片' : '视频'}</p>
                      <p className="text-xs mt-1">
                        {type === 'photo' ? 'JPG, PNG, GIF, WebP' : 'MP4, WebM, MOV'}
                      </p>
                    </div>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    accept={type === 'photo' ? 'image/*' : 'video/*'}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {file && (
                  <p className="text-xs text-gray-500 mt-1">
                    已选择：{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '发布中...' : '✅ 发布'}
              </button>
              <Link
                href="/admin/dashboard"
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-center"
              >
                取消
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
