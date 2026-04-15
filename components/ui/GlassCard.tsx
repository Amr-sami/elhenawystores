"use client"

import React from "react"

interface GlassCardProps {
  children: React.ReactNode
  title?: string
  action?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function GlassCard({ children, title, action, className, style }: GlassCardProps) {
  return (
    <div className={`glass-panel p-6 sm:p-8 animate-enter ${className}`} style={style}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-8">
          {title && (
            <h3 className="text-lg font-bold tracking-tight text-white/90 font-display">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
