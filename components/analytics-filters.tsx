"use client"

import { useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { t } from "@/lib/translations"
import { useLanguage } from "@/lib/language-context"
import { Calendar, Filter, ArrowRight, X, Check } from "lucide-react"

interface AnalyticsFiltersProps {
  timeRange: string
  setTimeRange: (range: string) => void
  selectedMonths: string[]
  setSelectedMonths: (months: string[]) => void
  customRange: { from: string; to: string }
  setCustomRange: (range: { from: string; to: string }) => void
}

export default function AnalyticsFilters({
  timeRange,
  setTimeRange,
  selectedMonths,
  setSelectedMonths,
  customRange,
  setCustomRange,
}: AnalyticsFiltersProps) {
  const { language } = useLanguage()

  const ranges = [
    { id: "week", label: t(language, "week") },
    { id: "month", label: t(language, "month") },
    { id: "quarter", label: t(language, "quarter") },
    { id: "year", label: t(language, "year") },
    { id: "all", label: t(language, "allStores") },
    { id: "custom", label: t(language, "custom") },
  ]

  // Generate last 12 months in MM/YY format
  const monthOptions = useMemo(() => {
    const options = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
       const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
       const label = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`
       options.push(label)
    }
    return options
  }, [])

  const toggleMonth = (month: string) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month))
    } else {
      setSelectedMonths([...selectedMonths, month])
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-enter w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Time Range Selector */}
        <div className="space-y-3 flex-1 min-w-[320px]">
          <div className="flex items-center gap-2 text-slate-500 ml-1">
            <Filter size={12} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t(language, "timeRange")}</span>
          </div>
          <div className="flex flex-wrap p-1 bg-secondary rounded-xl border border-border-subtle shadow-inner">
            {ranges.map((r) => (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  timeRange === r.id 
                    ? "bg-gold-500 text-primary-foreground shadow-lg scale-105" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range */}
        {timeRange === "custom" && (
          <div className="flex items-end gap-3 animate-enter">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                {t(language, "from")}
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={customRange.from}
                  onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                  className="bg-secondary border-border-subtle focus:border-gold-500/50 rounded-xl py-5 min-w-[140px]"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
              </div>
            </div>
            
            <div className="pb-3 text-slate-600 hidden sm:block">
              <ArrowRight size={14} className={language === "ar" ? "rotate-180" : ""} />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                {t(language, "to")}
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  value={customRange.to}
                  onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                  className="bg-secondary border-border-subtle focus:border-gold-500/50 rounded-xl py-5 min-w-[140px]"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTimeRange("month")}
              className="mb-1 h-10 w-10 text-slate-500 hover:text-red-400"
            >
              <X size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Multi-Month Pill Selector */}
      {timeRange === "month" && (
        <div className="animate-enter border-t border-border-subtle pt-6 space-y-3">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 ml-1">
                <Calendar size={12} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t(language, "selectDateRange")}</span>
              </div>
              {selectedMonths.length > 0 && (
                <button 
                  onClick={() => setSelectedMonths([])}
                  className="text-[10px] font-bold text-red-400/80 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  {t(language, "cancel")}
                </button>
              )}
           </div>
           <div className="flex flex-wrap gap-2">
              {monthOptions.map((month) => {
                const isSelected = selectedMonths.includes(month)
                return (
                  <button
                    key={month}
                    onClick={() => toggleMonth(month)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                      isSelected 
                        ? "bg-gold-500 text-primary-foreground border-gold-500 shadow-lg shadow-gold-500/10 scale-105" 
                        : "bg-secondary/40 text-slate-400 border-border-subtle hover:border-gold-500/30 hover:text-slate-200"
                    }`}
                  >
                    {isSelected && <Check size={10} />}
                    {month}
                  </button>
                )
              })}
           </div>
        </div>
      )}
    </div>
  )
}
