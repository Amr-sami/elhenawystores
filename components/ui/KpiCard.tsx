"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  delay?: number
}

export function KpiCard({ label, value, icon: Icon, trend, delay = 0 }: KpiCardProps) {
  return (
    <div 
      className="glass-panel p-6 sm:p-7 group hover-glass animate-enter"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-gold-400 transition-colors">
              {label}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:gold-shimmer transition-all">
              {value}
            </h4>
            {trend && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                trend.positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}>
                {trend.value}
              </span>
            )}
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gold-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 rounded-xl bg-secondary border border-border-subtle flex items-center justify-center text-slate-400 group-hover:text-gold-500 group-hover:border-gold-500/30 transition-all relative">
            <Icon size={24} />
          </div>
        </div>
      </div>
    </div>
  )
}
