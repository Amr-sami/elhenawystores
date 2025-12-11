interface SaleRecord {
  id: string
  store: string
  date: any
  totalSales: number
  perfume?: number
  watches?: number
  originalPerfumes?: number
  wallets?: number
}

interface AggregatedData {
  totalSales: number
  count: number
  average: number
  perfume?: number
  watches?: number
  originalPerfumes?: number
  wallets?: number
}

interface StoreComparison {
  store: string
  totalSales: number
  count: number
  average: number
}

export function getDateRange(period: "week" | "month" | "quarter" | "year", referenceDate?: Date) {
  const now = referenceDate || new Date()
  const start = new Date(now)

  switch (period) {
    case "week":
      start.setDate(now.getDate() - now.getDay())
      break
    case "month":
      start.setDate(1)
      break
    case "quarter":
      const quarter = Math.floor(now.getMonth() / 3)
      start.setMonth(quarter * 3)
      start.setDate(1)
      break
    case "year":
      start.setMonth(0)
      start.setDate(1)
      break
  }

  start.setHours(0, 0, 0, 0)
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export function filterSalesByDateRange(sales: SaleRecord[], startDate: Date, endDate: Date) {
  return sales.filter((sale) => {
    const saleDate = sale.date?.toDate ? sale.date.toDate() : new Date(sale.date)
    saleDate.setHours(0, 0, 0, 0)
    return saleDate >= startDate && saleDate <= endDate
  })
}

export function filterSalesByStore(sales: SaleRecord[], store: string) {
  return sales.filter((sale) => sale.store === store)
}

export function aggregateSales(sales: SaleRecord[]): AggregatedData {
  if (sales.length === 0) {
    return { totalSales: 0, count: 0, average: 0 }
  }

  let totalSales = 0
  let perfume = 0
  let watches = 0
  let originalPerfumes = 0
  let wallets = 0

  sales.forEach((sale) => {
    totalSales += sale.totalSales
    perfume += sale.perfume || 0
    watches += sale.watches || 0
    originalPerfumes += sale.originalPerfumes || 0
    wallets += sale.wallets || 0
  })

  return {
    totalSales,
    count: sales.length,
    average: totalSales / sales.length,
    perfume: perfume > 0 ? perfume : undefined,
    watches: watches > 0 ? watches : undefined,
    originalPerfumes: originalPerfumes > 0 ? originalPerfumes : undefined,
    wallets: wallets > 0 ? wallets : undefined,
  }
}

export function compareStores(sales: SaleRecord[]): StoreComparison[] {
  const stores = ["Elhenawy", "Konoz"]
  return stores.map((store) => {
    const storeSales = filterSalesByStore(sales, store)
    const agg = aggregateSales(storeSales)
    return {
      store,
      totalSales: agg.totalSales,
      count: agg.count,
      average: agg.average,
    }
  })
}

export function getMonthlyData(sales: SaleRecord[]) {
  const monthlyData: Record<string, AggregatedData> = {}

  sales.forEach((sale) => {
    const saleDate = sale.date?.toDate ? sale.date.toDate() : new Date(sale.date)
    const monthKey = saleDate.toLocaleString("en-EG", { year: "numeric", month: "short" })

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { totalSales: 0, count: 0, average: 0 }
    }

    monthlyData[monthKey].totalSales += sale.totalSales
    monthlyData[monthKey].count += 1
    monthlyData[monthKey].average = monthlyData[monthKey].totalSales / monthlyData[monthKey].count
  })

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
  }))
}

export function getCategoryComparison(sales: SaleRecord[]) {
  const elhenawySales = filterSalesByStore(sales, "Elhenawy")

  if (elhenawySales.length === 0) {
    return { perfume: 0, watches: 0, originalPerfumes: 0, wallets: 0 }
  }

  let totalPerfume = 0
  let totalWatches = 0
  let totalOriginalPerfumes = 0
  let totalWallets = 0

  elhenawySales.forEach((sale) => {
    totalPerfume += sale.perfume || 0
    totalWatches += sale.watches || 0
    totalOriginalPerfumes += sale.originalPerfumes || 0
    totalWallets += sale.wallets || 0
  })

  return {
    perfume: totalPerfume,
    watches: totalWatches,
    originalPerfumes: totalOriginalPerfumes,
    wallets: totalWallets,
  }
}
