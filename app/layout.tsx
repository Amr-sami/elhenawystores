import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, DM_Sans, Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/lib/language-context"
import { StoreProvider } from "@/lib/store-context"
import "./globals.css"

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
})

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "Elhenawy Stores | Premium Retail Dashboard",
  description: "Executive sales tracking and business intelligence for Elhenawy and Konoz stores",
  generator: "Antigravity UI/UX Pro Max",
}

import { SalesProvider } from "@/lib/sales-context"
import Sidebar from "@/components/layout/Sidebar"
import TopNav from "@/components/layout/TopNav"
import BottomNav from "@/components/layout/BottomNav"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable} ${cairo.variable}`}>
      <body className="font-body antialiased bg-background text-foreground h-screen overflow-hidden">
        <LanguageProvider>
          <StoreProvider>
            <SalesProvider>
              <div className="relative h-screen flex overflow-hidden">
                {/* Desktop Sidebar */}
                <Sidebar />
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                  {/* Top Navigation */}
                  <TopNav />
                  
                  {/* Page Content - Scrollable */}
                  <main className="flex-1 overflow-y-auto no-scrollbar pb-32 md:pb-10">
                    {children}
                  </main>
                  
                  {/* Mobile Navigation */}
                  <BottomNav />
                </div>
              </div>
              <Analytics />
            </SalesProvider>
          </StoreProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}


