"use client"

import { useState } from "react"
import { useSales } from "@/lib/sales-context"
import { useLanguage } from "@/lib/language-context"
import { useStore } from "@/lib/store-context"
import { t } from "@/lib/translations"
import SalesForm from "@/components/sales-form"
import SalesTable from "@/components/sales-table"
import { GlassCard } from "@/components/ui/GlassCard"
import { LayoutDashboard } from "lucide-react"

export default function Home() {
  const { sales, loading, deleteSale } = useSales()
  const { language } = useLanguage()
  const { store } = useStore()
  
  const [editingId, setEditingId] = useState<string | null>(null)

  // Filter sales for the table based on store
  const filteredSales = sales.filter((s) => store === "All" || s.store === store)

  const handleSaleAdded = () => {
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t(language, "deleteConfirm"))) return
    await deleteSale(id)
  }

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
      {/* Editorial Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="animate-enter">
          <div className="flex items-center gap-2 text-gold-500/60 mb-2">
            <LayoutDashboard size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{t(language, "management")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-tight">
            {t(language, "salesDashboard")}
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-2 max-w-md font-medium">
            {t(language, "trackManageAnalyze")}
          </p>
        </div>
      </div>

      <div className="space-y-10">
          {/* Editorial Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
            {/* Form Section - Conditional Rendering */}
            {store !== "All" ? (
              <div className="xl:col-span-4 sticky top-28 animate-enter">
                <GlassCard title={editingId ? t(language, "editRecord") : t(language, "addSales")}>
                  <SalesForm
                    onSaleAdded={handleSaleAdded}
                    editingId={editingId}
                    editingData={sales.find((s) => s.id === editingId)}
                    onEditCancel={() => setEditingId(null)}
                  />
                </GlassCard>
              </div>
            ) : null}

            {/* List Section - Dynamic Column Span */}
            <div className={store !== "All" ? "xl:col-span-8" : "xl:col-span-12"}>
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-6 bg-gold-500 rounded-full" />
                   <h3 className="text-xl font-display font-bold text-white tracking-tight">
                     {store === "All" ? t(language, "recentSales") : t(language, store === "Elhenawy" ? "elhenawyStore" : "konozStore")}
                   </h3>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                   {filteredSales.length} {t(language, "recentSales")}
                </div>
              </div>
              
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredSales.length === 0 ? (
                <div className="text-center py-20 bg-secondary/20 rounded-xl border border-border-subtle">
                  <p className="text-slate-500 font-medium">{t(language, "noRecords")}</p>
                </div>
              ) : (
                <SalesTable 
                  sales={filteredSales} 
                  onEdit={setEditingId} 
                  onDelete={handleDelete} 
                />
              )}
            </div>
          </div>
      </div>
    </div>
  )
}
