"use client"

import React from "react"
import { Search, Bell, Menu, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"

export default function TopNav() {
  const { language, setLanguage } = useLanguage()
  const { store, setStore } = useStore()

  const stores = [
    { id: "All", label: t(language, "allStores") },
    { id: "Elhenawy", label: t(language, "elhenawyStore") },
    { id: "Konoz", label: t(language, "konozStore") },
  ]

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between px-6 md:px-10 bg-background/50 backdrop-blur-xl border-b border-border-subtle overflow-hidden">
      {/* Search Bar - Desktop */}
      <div className="hidden md:flex items-center flex-1 max-w-md relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search records..." 
          className="w-full bg-secondary border border-border-subtle rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
        />
      </div>

      {/* Store Switcher - Integrated in Header */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <div className="flex items-center p-1 bg-secondary rounded-xl border border-border-subtle">
          {stores.map((s) => (
            <button
              key={s.id}
              onClick={() => setStore(s.id)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                store === s.id 
                  ? "bg-gold-500 text-primary-foreground shadow-lg" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 border-l border-border-subtle pl-4 ml-2 md:ml-4">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-secondary border border-border-subtle text-slate-400 hover:text-gold-400 transition-all">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-gold-500 rounded-full border-2 border-secondary" />
          </button>
          
          <button 
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="w-10 h-10 flex md:hidden items-center justify-center rounded-xl bg-secondary border border-border-subtle text-slate-400 hover:text-gold-400 transition-all"
          >
            <Globe size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
