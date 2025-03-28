import './globals.css'
import Header from "@/app/compontents/Header";
import Footer from "@/app/compontents/Footer";


export const metadata = {
  title: 'Turniej Piłkarski',
  description: 'Aplikacja do zarządzania turniejem',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="pl">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <Footer />
      </body>
      </html>
  )
}