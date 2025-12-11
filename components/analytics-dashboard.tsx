"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  aggregateSales,
  compareStores,
  getMonthlyData,
  getCategoryComparison,
  filterSalesByDateRange,
  filterSalesByStore,
} from "@/lib/analytics-utils"
import AnalyticsFilters, { type FilterState } from "./analytics-filters"
import { getDateRange } from "@/lib/analytics-utils"
import { t } from "@/lib/translations"
import type { Language } from "@/lib/translations"

const COLORS = {
  perfume: "#10b981",
  watches: "#06b6d4",
  originalPerfumes: "#f59e0b",
  wallets: "#8b5cf6",
}

interface AnalyticsDashboardProps {
  sales: any[]
  language: Language
}

export default function AnalyticsDashboard({ sales, language }: AnalyticsDashboardProps) {
  const [filters, setFilters] = useState<FilterState>({
    store: "all",
    period: "month",
  })

  const filteredSales = useMemo(() => {
    let data = [...sales]

    // Apply store filter
    if (filters.store !== "all") {
      data = filterSalesByStore(data, filters.store)
    }

    // Apply date range filter
    if (filters.period === "custom" && filters.startDate && filters.endDate) {
      data = filterSalesByDateRange(data, filters.startDate, filters.endDate)
    } else if (filters.period !== "custom") {
      const { start, end } = getDateRange(filters.period)
      data = filterSalesByDateRange(data, start, end)
    }

    return data
  }, [sales, filters])

  const aggregatedData = useMemo(() => aggregateSales(filteredSales), [filteredSales])
  const storeComparison = useMemo(() => compareStores(filteredSales), [filteredSales])
  const monthlyData = useMemo(() => getMonthlyData(filteredSales), [filteredSales])
  const categoryData = useMemo(() => getCategoryComparison(filteredSales), [filteredSales])

  const categoryChartData = useMemo(() => {
    const data = []
    if (categoryData.perfume > 0) data.push({ name: "Perfume", value: categoryData.perfume })
    if (categoryData.watches > 0) data.push({ name: "Watches", value: categoryData.watches })
    if (categoryData.originalPerfumes > 0)
      data.push({ name: "Original Perfumes", value: categoryData.originalPerfumes })
    if (categoryData.wallets > 0) data.push({ name: "Wallets", value: categoryData.wallets })
    return data
  }, [categoryData])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleCustomDateRange = (startDate: Date, endDate: Date) => {
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <AnalyticsFilters
        onFilterChange={handleFilterChange}
        onCustomDateRange={handleCustomDateRange}
        language={language}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 bg-slate-800 text-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">{t(language, "totalSalesAnalytics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
              {aggregatedData.totalSales.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {aggregatedData.count} {t(language, "transactionCount")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-slate-800 text-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">{t(language, "averageSalesAnalytics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-teal-400">{aggregatedData.average.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-2">{t(language, "custom")}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-slate-800 text-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-400">{t(language, "transactionCount")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{aggregatedData.count}</div>
            <p className="text-xs text-slate-500 mt-2">{t(language, "custom")}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-slate-800 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">{t(language, "custom")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-emerald-300 capitalize">
              {filters.period === "custom"
                ? `${filters.startDate?.toLocaleDateString()} - ${filters.endDate?.toLocaleDateString()}`
                : t(language, filters.period as any)}
            </div>
            <p className="text-xs text-slate-500 mt-2">{t(language, "custom")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Comparison */}
        <Card className="border-0 bg-slate-800 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t(language, "storeComparison")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storeComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="store" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Bar dataKey="totalSales" fill="#10b981" name={t(language, "totalSalesAnalytics")} />
                <Bar dataKey="average" fill="#06b6d4" name={t(language, "averageSalesAnalytics")} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="border-0 bg-slate-800 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t(language, "monthlyTrend")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#cbd5e1" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#10b981"
                  strokeWidth={2}
                  name={t(language, "totalSalesAnalytics")}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        {categoryChartData.length > 0 && (
          <Card className="border-0 bg-slate-800 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{t(language, "categoryDistribution")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Detailed Stats */}
        <Card className="border-0 bg-slate-800 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">{t(language, "categoryBreakdownAnalytics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400">{t(language, "transactionCount")}</span>
                <span className="font-semibold text-emerald-400">{aggregatedData.count}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400">{t(language, "totalSalesAnalytics")}</span>
                <span className="font-semibold text-teal-400">{aggregatedData.totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-400">{t(language, "averageSalesAnalytics")}</span>
                <span className="font-semibold text-cyan-400">{aggregatedData.average.toFixed(2)}</span>
              </div>
              {aggregatedData.perfume !== undefined && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">{t(language, "perfume")}</span>
                  <span className="font-semibold text-green-400">{aggregatedData.perfume.toFixed(2)}</span>
                </div>
              )}
              {aggregatedData.watches !== undefined && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">{t(language, "watches")}</span>
                  <span className="font-semibold text-cyan-400">{aggregatedData.watches.toFixed(2)}</span>
                </div>
              )}
              {aggregatedData.originalPerfumes !== undefined && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-400">{t(language, "originalPerfumes")}</span>
                  <span className="font-semibold text-amber-400">{aggregatedData.originalPerfumes.toFixed(2)}</span>
                </div>
              )}
              {aggregatedData.wallets !== undefined && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">{t(language, "wallets")}</span>
                  <span className="font-semibold text-purple-400">{aggregatedData.wallets.toFixed(2)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
