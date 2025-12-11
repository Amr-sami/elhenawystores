"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { t } from "@/lib/translations"
import type { Language } from "@/lib/translations"

interface SalesTableProps {
  sales: any[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  language: Language
}

export default function SalesTable({ sales, onEdit, onDelete, language }: SalesTableProps) {
  const formatDate = (date: any) => {
    if (!date) return ""
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString("en-EG") // Egypt locale
  }

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2)
  }

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return "0%"
    return `${((value / total) * 100).toFixed(1)}%`
  }

  return (
    <div className="overflow-x-auto -mx-6 sm:mx-0">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-slate-700/50 border-slate-700 hover:bg-slate-700/50">
            <TableHead className="font-semibold text-slate-200">{t(language, "store")}</TableHead>
            <TableHead className="font-semibold text-slate-200">{t(language, "date")}</TableHead>
            <TableHead className="text-right font-semibold text-slate-200">{t(language, "totalSalesHeader")}</TableHead>
            <TableHead className="text-right font-semibold text-slate-200 hidden sm:table-cell">
              {t(language, "categories")}
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-200 w-20">{t(language, "actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id} className="border-slate-700 hover:bg-slate-700/30 transition-colors">
              <TableCell className="font-medium text-slate-100">
                {sale.store === "Elhenawy" ? "🏪 " : "🏬 "}
                {t(language, sale.store === "Elhenawy" ? "elhenawyStore" : "konozStore")}
              </TableCell>
              <TableCell className="text-slate-300">{formatDate(sale.date)}</TableCell>
              <TableCell className="text-right font-semibold text-emerald-400">
                {formatCurrency(sale.totalSales)}
              </TableCell>
              <TableCell className="text-right text-slate-300 hidden sm:table-cell">
                {sale.store === "Elhenawy" &&
                (sale.perfume || sale.watches || sale.originalPerfumes || sale.wallets) ? (
                  <div className="text-xs space-y-1">
                    {sale.perfume > 0 && (
                      <div>
                        {t(language, "perfume")}: {formatCurrency(sale.perfume)} (
                        {calculatePercentage(sale.perfume, sale.totalSales)})
                      </div>
                    )}
                    {sale.watches > 0 && (
                      <div>
                        {t(language, "watches")}: {formatCurrency(sale.watches)} (
                        {calculatePercentage(sale.watches, sale.totalSales)})
                      </div>
                    )}
                    {sale.originalPerfumes > 0 && (
                      <div>
                        {t(language, "originalPerfumes")}: {formatCurrency(sale.originalPerfumes)} (
                        {calculatePercentage(sale.originalPerfumes, sale.totalSales)})
                      </div>
                    )}
                    {sale.wallets > 0 && (
                      <div>
                        {t(language, "wallets")}: {formatCurrency(sale.wallets)} (
                        {calculatePercentage(sale.wallets, sale.totalSales)})
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(sale.id)}
                      className="h-8 w-8 p-0 hover:bg-slate-600 text-slate-300"
                      title={t(language, "edit")}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(sale.id)}
                      className="h-8 w-8 p-0 hover:bg-red-900/50 text-red-400"
                      title={t(language, "delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
