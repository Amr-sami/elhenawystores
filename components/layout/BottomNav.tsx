"use client"

import React from "react"
import { LayoutDashboard, BarChart3, Plus, Settings, Store } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNav() {
  const { language } = useLanguage()
  const pathname = usePathname()

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, href: "/" },
    { id: "analytics", icon: BarChart3, href: "/analytics" },
    { id: "settings", icon: Settings, href: "/settings" },
  ]

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="glass-panel flex items-center justify-around p-2 gap-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all ${
                isActive ? "text-gold-500 bg-gold-500/5 shadow-[inset_0_0_10px_rgba(201,168,76,0.1)]" : "text-slate-400"
              }`}
            >
              <Icon size={20} className={isActive ? "gold-shimmer" : ""} />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{t(language, item.id as any)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
