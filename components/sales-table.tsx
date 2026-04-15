"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Store, Calendar, DollarSign, ChevronRight, MoreHorizontal } from "lucide-react"
import { t } from "@/lib/translations"
import { useLanguage } from "@/lib/language-context"

interface SalesTableProps {
  sales: any[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function SalesTable({ sales, onEdit, onDelete }: SalesTableProps) {
  const { language } = useLanguage()

  const formatDate = (date: any) => {
    if (!date) return ""
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString(language === "ar" ? "ar-EG" : "en-EG", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-EG", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border-subtle bg-secondary/30">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 border-border-subtle hover:bg-secondary/50">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 py-5">{t(language, "store")}</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t(language, "date")}</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">{t(language, "totalSalesHeader")}</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 px-8">{t(language, "actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} className="border-border-subtle hover:bg-white/[0.02] transition-colors group">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-tertiary flex items-center justify-center text-gold-500 border border-border-subtle">
                      <Store size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none mb-1">
                        {t(language, sale.store === "Elhenawy" ? "elhenawyStore" : "konozStore")}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        {sale.store}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-400 font-medium">{formatDate(sale.date)}</TableCell>
                <TableCell className="text-right">
                   <span className="text-sm font-bold text-emerald-400">
                    {formatCurrency(sale.totalSales)}
                  </span>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(sale.id)}
                        className="h-8 w-8 rounded-lg hover:bg-gold-500/10 hover:text-gold-500 transition-all"
                      >
                        <Edit2 size={14} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(sale.id)}
                        className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {sales.map((sale) => (
          <div key={sale.id} className="glass-panel p-5 space-y-4 relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-gold-500 border border-border-subtle">
                  <Store size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {t(language, sale.store === "Elhenawy" ? "elhenawyStore" : "konozStore")}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {formatDate(sale.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{t(language, "totalSalesHeader")}</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(sale.totalSales)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
               <div className="flex gap-4">
                 {sale.perfume > 0 && <div className="text-[10px] text-slate-400"><span className="text-white font-bold">{t(language, "perfume")}:</span> {formatCurrency(sale.perfume)}</div>}
                 {sale.watches > 0 && <div className="text-[10px] text-slate-400"><span className="text-white font-bold">{t(language, "watches")}:</span> {formatCurrency(sale.watches)}</div>}
               </div>
               <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit?.(sale.id)}
                    className="h-9 w-9 bg-secondary rounded-lg text-slate-400"
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete?.(sale.id)}
                    className="h-9 w-9 bg-red-500/5 rounded-lg text-red-400/70"
                  >
                    <Trash2 size={14} />
                  </Button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

