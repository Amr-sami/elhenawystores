"use client"

import React from "react"
import { LayoutDashboard, BarChart3, Settings, LogOut, ChevronRight, Store } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const { language, setLanguage } = useLanguage()
  const { store, setStore } = useStore()
  const pathname = usePathname()

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, href: "/" },
    { id: "analytics", icon: BarChart3, href: "/analytics" },
  ]

  return (
    <aside className="hidden md:flex flex-col w-[var(--nav-width)] bg-secondary border-r border-border-subtle h-screen sticky top-0 transition-all">
      {/* Brand Header */}
      <div className="p-8 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.2)]">
            <Store className="text-primary-foreground h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold leading-none tracking-tight">ELHENAWY</h2>
            <p className="text-[10px] text-gold-500 font-bold tracking-[0.3em] uppercase opacity-80 mt-1">Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-gold-500/10 text-gold-500 shadow-[inset_0_0_20px_rgba(201,168,76,0.05)]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon size={20} className={isActive ? "gold-shimmer" : "group-hover:text-gold-400 transition-colors"} />
                <span className="text-sm font-medium tracking-wide">{t(language, item.id as any)}</span>
              </div>
              {isActive && <div className="w-1 h-4 bg-gold-500 rounded-full" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions: Store & Language */}
      <div className="p-6 mt-auto space-y-6">
        {/* Language Switcher */}
        <div className="px-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 px-2">
            {t(language, "language")}
          </p>
          <div className="flex gap-2 p-1 bg-tertiary rounded-lg">
            {(["en", "ar"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  language === lang 
                    ? "bg-gold-500 text-primary-foreground shadow-lg" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {lang === "en" ? "EN" : "AR"}
              </button>
            ))}
          </div>
        </div>

        {/* User Info / Logout Placeholder */}
        <div className="pt-6 border-t border-border-subtle flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-border-medium" />
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-white truncate">Administrator</p>
            <p className="text-[10px] text-slate-500 truncate">Elhenawy Stores</p>
          </div>
          <button className="text-slate-500 hover:text-red-400 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
