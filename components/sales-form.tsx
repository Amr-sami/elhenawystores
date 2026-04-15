"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, addDoc, Timestamp, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getEgyptDate } from "@/lib/date-utils"
import { t } from "@/lib/translations"
import { useLanguage } from "@/lib/language-context"
import { useStore } from "@/lib/store-context"
import { Sparkles, Save, X, Calculator, Plus, Minus, LayoutDashboard } from "lucide-react"

interface SalesFormProps {
  onSaleAdded: () => void
  editingId?: string | null
  editingData?: any
  onEditCancel?: () => void
}

export default function SalesForm({ onSaleAdded, editingId, editingData, onEditCancel }: SalesFormProps) {
  const { language } = useLanguage()
  const { store } = useStore() // This is the 'Filter' store, but for ADDING we need a specific one
  const [selectedStore, setSelectedStore] = useState<string>("Elhenawy")
  const [date, setDate] = useState<string>("")
  const [totalSales, setTotalSales] = useState<string>("")
  const [perfume, setPerfume] = useState<string>("")
  const [watches, setWatches] = useState<string>("")
  const [originalPerfumes, setOriginalPerfumes] = useState<string>("")
  const [wallets, setWallets] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [showCategoryBreakdown, setShowCategoryBreakdown] = useState(false)

  useEffect(() => {
    // If we have a global store selected, use it. Otherwise default to Elhenawy.
    if (store !== "All") {
      setSelectedStore(store)
    }

    if (editingData && editingId) {
      const editDate = (editingData.date as any)?.toDate ? (editingData.date as any).toDate() : new Date(editingData.date as any)
      const dateStr = editDate.toISOString().split("T")[0]
      setSelectedStore(editingData.store)
      setDate(dateStr)
      setTotalSales(editingData.totalSales?.toString() || "")
      setPerfume(editingData.perfume?.toString() || "")
      setWatches(editingData.watches?.toString() || "")
      setOriginalPerfumes(editingData.originalPerfumes?.toString() || "")
      setWallets(editingData.wallets?.toString() || "")
      setShowCategoryBreakdown(
        editingData.perfume > 0 || editingData.watches > 0 || editingData.originalPerfumes > 0 || editingData.wallets > 0
      )
    } else {
      const egyptDate = getEgyptDate()
      setDate(egyptDate)
      setTotalSales("")
      setPerfume("")
      setWatches("")
      setOriginalPerfumes("")
      setWallets("")
    }
  }, [editingData, editingId, store])

  // NEW: Auto-calculation logic for Perfumes (Remainder category)
  useEffect(() => {
    if (selectedStore === "Elhenawy" && showCategoryBreakdown) {
      const total = parseFloat(totalSales || "0")
      const others = parseFloat(watches || "0") + parseFloat(originalPerfumes || "0") + parseFloat(wallets || "0")
      const calculatedPerfume = Math.max(0, total - others)
      
      // Update perfume state as a string for the input
      // Only update if it actually changes to avoid infinite loops
      const currentPerfume = parseFloat(perfume || "0")
      if (Math.abs(calculatedPerfume - currentPerfume) > 0.01) {
        setPerfume(calculatedPerfume === 0 ? "" : calculatedPerfume.toFixed(2))
      }
    }
  }, [totalSales, watches, originalPerfumes, wallets, selectedStore, showCategoryBreakdown])

  const validateCategoryTotal = () => {
    if (selectedStore === "Elhenawy" && showCategoryBreakdown) {
      const perfumeVal = Number.parseFloat(perfume || "0")
      const watchesVal = Number.parseFloat(watches || "0")
      const originalPerfumesVal = Number.parseFloat(originalPerfumes || "0")
      const walletsVal = Number.parseFloat(wallets || "0")
      const categoryTotal = perfumeVal + watchesVal + originalPerfumesVal + walletsVal
      const totalVal = Number.parseFloat(totalSales || "0")

      if (Math.abs(categoryTotal - totalVal) > 0.01) {
        setError(
          t(language, "categoryMismatch")
            .replace("{total}", categoryTotal.toFixed(2))
            .replace("{sales}", totalVal.toFixed(2))
        )
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedStore || !date || !totalSales) {
      setError(t(language, "fillAllFields"))
      return
    }

    if (!validateCategoryTotal()) {
      return
    }

    setLoading(true)
    try {
      const saleData: any = {
        store: selectedStore,
        date: new Date(date),
        totalSales: Number.parseFloat(totalSales),
        timestamp: Timestamp.now(),
      }

      if (selectedStore === "Elhenawy") {
        saleData.perfume = Number.parseFloat(perfume || "0")
        saleData.watches = Number.parseFloat(watches || "0")
        saleData.originalPerfumes = Number.parseFloat(originalPerfumes || "0")
        saleData.wallets = Number.parseFloat(wallets || "0")
      } else {
        saleData.perfume = 0
        saleData.watches = 0
        saleData.originalPerfumes = 0
        saleData.wallets = 0
      }

      if (editingId) {
        await updateDoc(doc(db, "sales", editingId), saleData)
      } else {
        await addDoc(collection(db, "sales"), saleData)
      }

      setTotalSales("")
      setPerfume("")
      setWatches("")
      setOriginalPerfumes("")
      setWallets("")
      
      onSaleAdded()
    } catch (err) {
      setError(t(language, "failedToSave"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm animate-enter">
          {error}
        </div>
      )}

      {/* Store Selection Pills - Only shown if viewing All Stores */}
      {store === "All" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500">
            <LayoutDashboard size={12} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t(language, "store")}</span>
          </div>
          <div className="flex p-1 bg-secondary rounded-xl border border-border-subtle">
            {["Elhenawy", "Konoz"].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedStore(id)}
                className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  selectedStore === id 
                    ? "bg-gold-500 text-primary-foreground shadow-lg" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {t(language, id === "Elhenawy" ? "elhenawyStore" : "konozStore")}
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
            {t(language, "date")}
          </Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-secondary border-border-subtle focus:border-gold-500/50 rounded-xl py-6"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
            {t(language, "totalSales")}
          </Label>
          <div className="relative">
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={totalSales}
              onChange={(e) => setTotalSales(e.target.value)}
              className="bg-secondary border-border-subtle focus:border-gold-500/50 rounded-xl py-6 pl-10"
            />
            <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          </div>
        </div>
      </div>

      {/* Category Breakdown Section */}
      {selectedStore === "Elhenawy" && (
        <div className="pt-4 border-t border-border-subtle space-y-6">
          <button
            type="button"
            onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
            className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-gold-400 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20">
              {showCategoryBreakdown ? <Minus size={12} /> : <Plus size={12} />}
            </div>
            {t(language, showCategoryBreakdown ? "hideCategoryBreakdown" : "addCategoryBreakdown")}
          </button>

              {showCategoryBreakdown && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 animate-enter">
                  {[
                    { id: "perfume", val: perfume, set: setPerfume },
                    { id: "watches", val: watches, set: setWatches },
                    { id: "originalPerfumes", val: originalPerfumes, set: setOriginalPerfumes },
                    { id: "wallets", val: wallets, set: setWallets },
                  ].map((cat) => (
                    <div key={cat.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                          {t(language, cat.id as any)}
                        </Label>
                        {cat.id === "perfume" && (
                          <span className="text-[9px] font-bold text-gold-500 uppercase tracking-widest opacity-80 animate-pulse">
                            {language === "ar" ? "حساب تلقائي" : "Auto-calculated"}
                          </span>
                        )}
                      </div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={cat.val}
                        onChange={(e) => cat.set(e.target.value)}
                        readOnly={cat.id === "perfume"}
                        className={`border-border-subtle focus:border-gold-500/50 rounded-xl py-5 transition-all ${
                          cat.id === "perfume" 
                            ? "bg-gold-500/5 border-gold-500/20 text-gold-500/90 cursor-default" 
                            : "bg-tertiary/50"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}
        </div>
      )}

      {/* Actions */}
      <div className="pt-8 flex gap-3">
        <Button 
          type="submit" 
          disabled={loading} 
          className="flex-1 bg-gold-500 hover:bg-gold-400 text-primary-foreground font-bold uppercase tracking-widest py-7 rounded-xl shadow-lg shadow-gold-500/10 transition-all hover:scale-[1.02]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <Save size={18} />
              {editingId ? t(language, "update") : t(language, "save")}
            </div>
          )}
        </Button>
        
        {editingId && (
          <Button
            type="button"
            onClick={onEditCancel}
            className="bg-secondary border border-border-subtle text-slate-400 hover:text-white px-8 rounded-xl"
          >
            <X size={18} />
          </Button>
        )}
      </div>
    </form>
  )
}
