import './globals.css'
import Header from "@/app/compontents/Header";
import Footer from "@/app/compontents/Footer";
import { Inter } from 'next/font/google'
import AdminSidebar from "@/app/compontents/AdminSidebar";

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Turniej Piłkarski',
  description: 'Aplikacja do zarządzania turniejem',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="pl">
        <body className={`${inter.className} bg-background text-gray-900`}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col md:ml-16">
            <Header />
            <main className="flex-1 container mx-auto p-4">{children}</main>
            <Footer />
        </div>
        </body>
      </html>
  )
}