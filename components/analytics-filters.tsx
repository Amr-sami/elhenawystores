"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import { t } from "@/lib/translations"
import type { Language } from "@/lib/translations"

interface AnalyticsFiltersProps {
  onFilterChange: (filters: FilterState) => void
  onCustomDateRange: (startDate: Date, endDate: Date) => void
  language: Language
}

export interface FilterState {
  store: "all" | "Elhenawy" | "Konoz"
  period: "week" | "month" | "quarter" | "year" | "custom"
  startDate?: Date
  endDate?: Date
}

export default function AnalyticsFilters({ onFilterChange, onCustomDateRange, language }: AnalyticsFiltersProps) {
  const [store, setStore] = useState<"all" | "Elhenawy" | "Konoz">("all")
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year" | "custom">("month")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  const handleStoreChange = (value: string) => {
    const newStore = value as "all" | "Elhenawy" | "Konoz"
    setStore(newStore)
    onFilterChange({ store: newStore, period })
  }

  const handlePeriodChange = (value: string) => {
    const newPeriod = value as "week" | "month" | "quarter" | "year" | "custom"
    setPeriod(newPeriod)

    if (newPeriod !== "custom") {
      setCustomStart("")
      setCustomEnd("")
      onFilterChange({ store, period: newPeriod })
    }
  }

  const handleCustomDateApply = () => {
    if (customStart && customEnd) {
      const start = new Date(customStart)
      const end = new Date(customEnd)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      onCustomDateRange(start, end)
      onFilterChange({ store, period: "custom", startDate: start, endDate: end })
    }
  }

  return (
    <Card className="border-0 bg-slate-800 text-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-lg border-b-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Filters & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Store Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-200">{t(language, "storeFilter")}</Label>
            <Select value={store} onValueChange={handleStoreChange}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">{t(language, "allStores")}</SelectItem>
                <SelectItem value="Elhenawy">{t(language, "elhenawyStore")}</SelectItem>
                <SelectItem value="Konoz">{t(language, "konozStore")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Period Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-200">{t(language, "timeRange")}</Label>
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="week">{t(language, "week")}</SelectItem>
                <SelectItem value="month">{t(language, "month")}</SelectItem>
                <SelectItem value="quarter">{t(language, "quarter")}</SelectItem>
                <SelectItem value="year">{t(language, "year")}</SelectItem>
                <SelectItem value="custom">{t(language, "custom")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {period === "custom" && (
            <div className="space-y-3 pt-3 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-300">{t(language, "from")}</Label>
                  <Input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-slate-300">{t(language, "to")}</Label>
                  <Input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={handleCustomDateApply}
                disabled={!customStart || !customEnd}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              >
                {t(language, "apply")}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
