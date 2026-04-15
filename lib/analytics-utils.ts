import { t } from "./translations"

export interface SaleRecord {
  id: string
  store: string
  date: any
  totalSales: number
  perfume?: number
  watches?: number
  originalPerfumes?: number
  wallets?: number
}

/**
 * Calculates high-level KPIs from a list of sales records
 */
export function calculateKPIs(sales: SaleRecord[]) {
  if (!sales || sales.length === 0) {
    return { totalSales: 0, averageValue: 0, count: 0 }
  }

  const totalSales = sales.reduce((acc, sale) => acc + (sale.totalSales || 0), 0)
  
  return {
    totalSales,
    averageValue: totalSales / sales.length,
    count: sales.length,
  }
}

/**
 * Aggregates category breakdown for Elhenawy store (where categories are tracked)
 */
export function getCategoryData(sales: SaleRecord[], language: "en" | "ar") {
  const elhenawySales = sales.filter((s) => s.store === "Elhenawy")
  
  const totals = {
    perfume: 0,
    watches: 0,
    originalPerfumes: 0,
    wallets: 0,
  }

  elhenawySales.forEach((s) => {
    totals.perfume += s.perfume || 0
    totals.watches += s.watches || 0
    totals.originalPerfumes += s.originalPerfumes || 0
    totals.wallets += s.wallets || 0
  })

  return [
    { name: t(language, "perfume"), value: totals.perfume },
    { name: t(language, "watches"), value: totals.watches },
    { name: t(language, "originalPerfumes"), value: totals.originalPerfumes },
    { name: t(language, "wallets"), value: totals.wallets },
  ].filter(item => item.value > 0)
}

/**
 * Compares total sales between stores
 */
export function getStoreComparisonData(sales: SaleRecord[], language: "en" | "ar") {
  const stores = ["Elhenawy", "Konoz"]
  
  return stores.map((s) => {
    const storeSales = sales.filter(item => item.store === s)
    const total = storeSales.reduce((acc, curr) => acc + curr.totalSales, 0)
    
    return {
      id: s,
      name: t(language, s === "Elhenawy" ? "elhenawyStore" : "konozStore"),
      sales: total,
    }
  })
}

/**
 * Prepares data for multi-series category trend visualization
 * Returns: { month: "Mar 24", perfume: 100, watches: 200, ... }
 */
export function getCategoryTrendData(sales: SaleRecord[], language: "en" | "ar") {
  const trendMap: Record<string, any> = {}

  // Sort by date first
  const sortedSales = [...sales].sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  sortedSales.forEach((s) => {
    const d = s.date?.toDate ? s.date.toDate() : new Date(s.date)
    const key = d.toLocaleDateString(language === "ar" ? "ar-EG" : "en-EG", {
      month: "short",
      year: "2-digit"
    })
    
    if (!trendMap[key]) {
      trendMap[key] = { 
        month: key, 
        total: 0,
        [t(language, "perfume")]: 0, 
        [t(language, "watches")]: 0, 
        [t(language, "originalPerfumes")]: 0, 
        [t(language, "wallets")]: 0 
      }
    }
    
    trendMap[key].total += s.totalSales
    trendMap[key][t(language, "perfume")] += s.perfume || 0
    trendMap[key][t(language, "watches")] += s.watches || 0
    trendMap[key][t(language, "originalPerfumes")] += s.originalPerfumes || 0
    trendMap[key][t(language, "wallets")] += s.wallets || 0
  })

  return Object.values(trendMap)
}

/**
 * Advanced Business Insight Engine
 * Analyzes sales patterns and returns actionable highlights
 */
export function generateInsights(sales: SaleRecord[], language: "en" | "ar") {
  if (!sales || sales.length === 0) return []

  const insights: string[] = []
  
  // 1. Top Performing Category
  const categoryTotals = {
    perfume: sales.reduce((acc, s) => acc + (s.perfume || 0), 0),
    watches: sales.reduce((acc, s) => acc + (s.watches || 0), 0),
    originalPerfumes: sales.reduce((acc, s) => acc + (s.originalPerfumes || 0), 0),
    wallets: sales.reduce((acc, s) => acc + (s.wallets || 0), 0),
  }

  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  const topCat = categories[0]
  
  if (topCat[1] > 0) {
    insights.push(
      language === "ar" 
        ? `الفئة الأعلى أداءً هي ${t(language, topCat[0] as any)} بإجمالي ${topCat[1].toLocaleString()} جنيه.`
        : `Top performing category: ${t(language, topCat[0] as any)} with ${topCat[1].toLocaleString()} EGP.`
    )
  }

  // 2. Peak Day Detection
  const days: Record<number, number> = {}
  sales.forEach(s => {
    const d = s.date?.toDate ? s.date.toDate() : new Date(s.date)
    const day = d.getDay()
    days[day] = (days[day] || 0) + s.totalSales
  })

  const weekdayNames = language === "ar" 
    ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const peakDayEntry = Object.entries(days).sort((a, b) => b[1] - a[1])[0]
  if (peakDayEntry) {
    const dayName = weekdayNames[parseInt(peakDayEntry[0])]
    insights.push(
      language === "ar"
        ? `أيام ${dayName} هي وقت ذروة مبيعاتك.`
        : `${dayName}s are your peak sales days.`
    )
  }

  // 3. Efficiency / Average per transaction
  const total = sales.reduce((acc, s) => acc + s.totalSales, 0)
  const avg = total / sales.length
  if (avg > 1000) {
    insights.push(
      language === "ar"
        ? `متوسط قيمة العملية مرتفع (${avg.toFixed(0)} جنيه)، مما يشير إلى مبيعات متميزة.`
        : `High average transaction value (${avg.toFixed(0)} EGP) indicates premium sales volume.`
    )
  }

  return insights
}

/**
 * Calculates Period-over-Period growth for each category
 */
export function calculateCategoryGrowth(allSales: SaleRecord[], filteredSales: SaleRecord[]) {
  if (!filteredSales || filteredSales.length === 0) return []

  // 1. Determine Current Period Range
  const currentDates = filteredSales.map(s => s.date?.toDate ? s.date.toDate().getTime() : new Date(s.date).getTime())
  const minDate = Math.min(...currentDates)
  const maxDate = Math.max(...currentDates)
  const duration = maxDate - minDate + (24 * 60 * 60 * 1000) // inclusive day

  // 2. Determine Previous Period Range
  const prevMaxDate = minDate - 1
  const prevMinDate = minDate - duration

  const prevSales = allSales.filter(s => {
    const d = s.date?.toDate ? s.date.toDate().getTime() : new Date(s.date).getTime()
    return d >= prevMinDate && d <= prevMaxDate
  })

  const categories = ["perfume", "watches", "originalPerfumes", "wallets"]
  
  return categories.map(cat => {
    const currentTotal = filteredSales.reduce((acc, s) => acc + ((s as any)[cat] || 0), 0)
    const prevTotal = prevSales.reduce((acc, s) => acc + ((s as any)[cat] || 0), 0)
    
    let growth = 0
    if (prevTotal > 0) {
      growth = ((currentTotal - prevTotal) / prevTotal) * 100
    } else if (currentTotal > 0) {
      growth = 100 // New growth from zero
    }

    return {
      id: cat,
      currentTotal,
      prevTotal,
      growth: Math.abs(growth),
      isUp: growth >= 0
    }
  })
}

/**
 * Prepares data for monthly trend visualization (Total Sales)
 */
export function getMonthlyTrendData(sales: SaleRecord[], language: "en" | "ar") {
  const trendData = getCategoryTrendData(sales, language)
  return trendData.map(d => ({
    month: d.month,
    sales: d.total
  }))
}


