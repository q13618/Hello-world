import './globals.css'

export const metadata = {
  title: 'My Blog',
  description: 'A personal blog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
