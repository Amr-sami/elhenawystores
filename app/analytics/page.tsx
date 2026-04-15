"use client"

import { useState, useEffect } from "react"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import { GlassCard } from "@/components/ui/GlassCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, ShieldCheck, AlertCircle, KeyRound } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"

export default function AnalyticsPage() {
  const { language } = useLanguage()
  const [password, setPassword] = useState("")
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [error, setError] = useState(false)

  // Password from user: 151065
  const MANAGEMENT_PASSWORD = "151065"

  useEffect(() => {
    // Check session storage on mount
    const auth = sessionStorage.getItem("analytics_auth")
    setIsAuthorized(auth === "true")
  }, [])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === MANAGEMENT_PASSWORD) {
      sessionStorage.setItem("analytics_auth", "true")
      setIsAuthorized(true)
      setError(false)
    } else {
      setError(true)
      setPassword("")
    }
  }

  if (isAuthorized === null) return null // Prevent flash

  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 animate-enter">
        <GlassCard className="max-w-md w-full p-10 border-gold-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(201,168,76,0.1)] relative overflow-hidden group">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl group-hover:bg-gold-500/10 transition-colors" />
          
          <div className="relative z-10 text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary border border-border-subtle shadow-inner mb-2">
              <KeyRound className="text-gold-500 h-10 w-10 gold-shimmer" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                {t(language, "accessManagement")}
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                 {language === "ar" ? "منطقة محدودة للمسؤولين فقط" : "Restricted Management Zone"}
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-6">
              <div className="space-y-2 text-left">
                <div className="relative group/input">
                  <Input
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-tertiary/50 border-border-subtle focus:border-gold-500/50 rounded-xl py-7 text-center text-xl tracking-[0.5em] transition-all ${
                      error ? "border-red-500/50 ring-2 ring-red-500/10" : ""
                    }`}
                    autoFocus
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-gold-500 transition-colors" size={18} />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest ml-2 animate-enter">
                    <AlertCircle size={12} />
                    {t(language, "invalidPassword")}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gold-500 hover:bg-gold-400 text-primary-foreground font-bold uppercase tracking-[0.2em] py-7 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                   <ShieldCheck size={20} />
                   {t(language, "unlock")}
                </div>
              </Button>
            </form>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
      <AnalyticsDashboard />
    </div>
  )
}
