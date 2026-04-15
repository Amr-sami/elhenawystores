"use client"

import { useState, useMemo } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from "recharts"
import { useSales } from "@/lib/sales-context"
import { useLanguage } from "@/lib/language-context"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"
import { KpiCard } from "@/components/ui/KpiCard"
import { GlassCard } from "@/components/ui/GlassCard"
import AnalyticsFilters from "./analytics-filters"
import { 
  getCategoryData, 
  getStoreComparisonData, 
  getMonthlyTrendData,
  getCategoryTrendData,
  generateInsights,
  calculateCategoryGrowth,
  calculateKPIs 
} from "@/lib/analytics-utils"
import { TrendingUp, TrendingDown, Users, ShoppingBag, BarChart2 } from "lucide-react"

export default function AnalyticsDashboard() {
  const { sales, loading } = useSales()
  const { language } = useLanguage()
  const { store } = useStore()
  
  const [timeRange, setTimeRange] = useState("month")
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [customRange, setCustomRange] = useState<{ from: string; to: string }>({
    from: "",
    to: ""
  })

  // Filter sales based on store and date
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = sale.date?.toDate ? sale.date.toDate() : new Date(sale.date)
      
      // Store filter
      if (store !== "All" && sale.store !== store) return false
      
      // Date filter
      if (timeRange === "all") return true

      // NEW: Multi-Month Selection Logic
      if (timeRange === "month" && selectedMonths.length > 0) {
        const monthYearKey = `${(saleDate.getMonth() + 1).toString().padStart(2, '0')}/${saleDate.getFullYear().toString().slice(-2)}`
        return selectedMonths.includes(monthYearKey)
      }
      
      const now = new Date()
      const diff = now.getTime() - saleDate.getTime()
      const dayInMs = 24 * 60 * 60 * 1000

      if (timeRange === "week") return diff <= 7 * dayInMs
      if (timeRange === "month") return diff <= 30 * dayInMs // Fallback if no specific months selected
      if (timeRange === "quarter") return diff <= 90 * dayInMs
      if (timeRange === "year") return diff <= 365 * dayInMs
      
      if (timeRange === "custom" && customRange.from && customRange.to) {
        const fromDate = new Date(customRange.from)
        const toDate = new Date(customRange.to)
        return saleDate >= fromDate && saleDate <= toDate
      }
      
      return true
    })
  }, [sales, store, timeRange, customRange, selectedMonths])


  const kpis = useMemo(() => calculateKPIs(filteredSales), [filteredSales])
  const categoryData = useMemo(() => getCategoryData(filteredSales, language), [filteredSales, language])
  const storeData = useMemo(() => getStoreComparisonData(filteredSales, language), [filteredSales, language])
  const trendData = useMemo(() => getMonthlyTrendData(filteredSales, language), [filteredSales, language])
  const categoryTrendData = useMemo(() => getCategoryTrendData(filteredSales, language), [filteredSales, language])
  const insights = useMemo(() => generateInsights(filteredSales, language), [filteredSales, language])
  const categoryGrowth = useMemo(() => calculateCategoryGrowth(sales, filteredSales), [sales, filteredSales])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-EG", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val)
  }

  // Pro Max Chart Settings
  const CHART_COLORS = ["#C9A84C", "#3B82F6", "#10B981", "#EC4899", "#8B5CF6"]
  const TOOLTIP_STYLE = {
    backgroundColor: "#1A1D26",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    fontSize: "10px",
    fontWeight: "bold",
    color: "#F5F0E8"
  }

  const categoryLabels = [
    t(language, "perfume"),
    t(language, "watches"),
    t(language, "originalPerfumes"),
    t(language, "wallets")
  ]

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-stagger mb-10 px-4 sm:px-0">
      {/* Executive Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-8 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2 text-gold-500 mb-2">
            <BarChart2 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{t(language, "executiveSummary")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
             {store === "All" ? t(language, "allStores") : t(language, store === "Elhenawy" ? "elhenawyStore" : "konozStore")}
          </h2>
        </div>
        
        <AnalyticsFilters 
          timeRange={timeRange} 
          setTimeRange={setTimeRange} 
          selectedMonths={selectedMonths}
          setSelectedMonths={setSelectedMonths}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard 
          label={t(language, "totalSalesAnalytics")} 
          value={formatCurrency(kpis.totalSales)} 
          icon={TrendingUp} 
          trend={{ value: "+12.5%", positive: true }}
          delay={100}
        />
        <KpiCard 
          label={t(language, "averageSalesAnalytics")} 
          value={formatCurrency(kpis.averageValue)} 
          icon={ShoppingBag} 
          trend={{ value: "+2.1%", positive: true }}
          delay={200}
        />
        <KpiCard 
          label={t(language, "transactionCount")} 
          value={kpis.count} 
          icon={Users} 
          trend={{ value: "-4", positive: false }}
          delay={300}
        />
      </div>

      {/* Category Intelligence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 animate-stagger">
        {categoryGrowth.map((cat, idx) => {
          const catName = t(language, cat.id as any)
          return (
            <GlassCard key={cat.id} className="p-5 flex flex-col justify-between hover:bg-white/[0.03] transition-all group animate-enter" style={{ animationDelay: `${idx * 100}ms`}}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{catName}</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold ${
                  cat.isUp ? "bg-gold-500/10 text-gold-500" : "bg-red-500/10 text-red-400"
                }`}>
                  {cat.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {cat.growth.toFixed(1)}%
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                   <p className="text-xl font-display font-bold text-white group-hover:text-gold-500 transition-colors">
                     {formatCurrency(cat.currentTotal)}
                   </p>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mt-1">
                     {language === "ar" ? "مقابل الفترة السابقة" : "vs previous period"}
                   </p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  cat.isUp ? "bg-gold-500/5 text-gold-500" : "bg-red-500/5 text-red-500/50"
                }`}>
                   {cat.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Business Insights Module */}
      {insights.length > 0 && (
        <GlassCard className="border-gold-500/10 bg-gradient-to-br from-gold-500/5 to-transparent animate-enter">
          <div className="flex items-center gap-2 text-gold-500 mb-6">
             <TrendingUp size={16} />
             <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{language === "ar" ? "رؤى الأعمال التنفيذية" : "EXECUTIVE BUSINESS INSIGHTS"}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {insights.map((insight, idx) => (
               <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">{insight}</p>
               </div>
             ))}
          </div>
        </GlassCard>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Trend Line Chart - Multi-Series Portfolio */}
        <GlassCard 
          title={language === "ar" ? "اتجاه الفئات" : "Category Trend Portfolio"} 
          className="xl:col-span-8 overflow-hidden"
        >
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categoryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} 
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={TOOLTIP_STYLE} 
                  cursor={{ stroke: "rgba(255, 255, 255, 0.05)", strokeWidth: 2 }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ paddingBottom: '20px' }}
                  formatter={(value) => <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">{value}</span>}
                />
                {/* Individual Category Lines */}
                {categoryLabels.map((label, idx) => (
                  <Line 
                    key={label}
                    type="monotone" 
                    dataKey={label} 
                    stroke={CHART_COLORS[idx % CHART_COLORS.length]} 
                    strokeWidth={isSelected(label) ? 3 : 1.5} 
                    dot={{ fill: CHART_COLORS[idx % CHART_COLORS.length], r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                ))}
                {/* Total Trend Overlay */}
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name={t(language, "totalSalesHeader")}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Category Distribution Pie */}
        <GlassCard 
          title={t(language, "categoryDistribution")} 
          className="xl:col-span-4"
        >
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Store Comparison Bar Chart */}
        {store === "All" && (
          <GlassCard 
            title={t(language, "storeComparison")} 
            className="xl:col-span-12"
          >
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={storeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }} 
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar 
                    dataKey="sales" 
                    fill="#C9A84C" 
                    radius={[10, 10, 0, 0]} 
                    barSize={40}
                    className="hover:fill-gold-400 transition-colors"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}

// Simple helper to avoid clutter
function isSelected(label: string) {
  return true; // Expandable later
}

