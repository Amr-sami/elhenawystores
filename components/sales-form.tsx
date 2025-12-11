"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, addDoc, Timestamp, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getEgyptDate } from "@/lib/date-utils"
import { t } from "@/lib/translations"
import type { Language } from "@/lib/translations"

interface SalesFormProps {
  onSaleAdded: () => void
  editingId?: string | null
  editingData?: any
  onEditCancel?: () => void
  language: Language
}

export default function SalesForm({ onSaleAdded, editingId, editingData, onEditCancel, language }: SalesFormProps) {
  const [store, setStore] = useState<string>("")
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
    if (editingData && editingId) {
      const editDate = editingData.date?.toDate ? editingData.date.toDate() : new Date(editingData.date)
      const dateStr = editDate.toISOString().split("T")[0]
      setStore(editingData.store)
      setDate(dateStr)
      setTotalSales(editingData.totalSales?.toString() || "")
      setPerfume(editingData.perfume?.toString() || "")
      setWatches(editingData.watches?.toString() || "")
      setOriginalPerfumes(editingData.originalPerfumes?.toString() || "")
      setWallets(editingData.wallets?.toString() || "")
      setShowCategoryBreakdown(
        editingData.store === "Elhenawy" &&
          (editingData.perfume || editingData.watches || editingData.originalPerfumes || editingData.wallets),
      )
    } else {
      const egyptDate = getEgyptDate()
      setDate(egyptDate)
      setStore("")
      setTotalSales("")
      setPerfume("")
      setWatches("")
      setOriginalPerfumes("")
      setWallets("")
      setShowCategoryBreakdown(false)
    }
  }, [editingData, editingId])

  const validateCategoryTotal = () => {
    if (store === "Elhenawy" && showCategoryBreakdown) {
      const perfumeVal = Number.parseFloat(perfume || "0")
      const watchesVal = Number.parseFloat(watches || "0")
      const originalPerfumesVal = Number.parseFloat(originalPerfumes || "0")
      const walletsVal = Number.parseFloat(wallets || "0")
      const categoryTotal = perfumeVal + watchesVal + originalPerfumesVal + walletsVal
      const totalVal = Number.parseFloat(totalSales || "0")

      if (categoryTotal !== totalVal) {
        setError(
          `Category breakdown total (${categoryTotal.toFixed(2)}) must equal total sales (${totalVal.toFixed(2)})`,
        )
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!store || !date || !totalSales) {
      setError("Please fill in all required fields")
      return
    }

    if (!validateCategoryTotal()) {
      return
    }

    setLoading(true)
    try {
      const saleData: any = {
        store,
        date: new Date(date),
        totalSales: Number.parseFloat(totalSales),
        timestamp: Timestamp.now(),
      }

      if (store === "Elhenawy") {
        saleData.perfume = Number.parseFloat(perfume || "0")
        saleData.watches = Number.parseFloat(watches || "0")
        saleData.originalPerfumes = Number.parseFloat(originalPerfumes || "0")
        saleData.wallets = Number.parseFloat(wallets || "0")
      }

      if (editingId) {
        await updateDoc(doc(db, "sales", editingId), saleData)
      } else {
        await addDoc(collection(db, "sales"), saleData)
      }

      // Reset form
      setStore("")
      const egyptDate = getEgyptDate()
      setDate(egyptDate)
      setTotalSales("")
      setPerfume("")
      setWatches("")
      setOriginalPerfumes("")
      setWallets("")
      setShowCategoryBreakdown(false)

      onSaleAdded()
    } catch (err) {
      setError("Failed to save sales data. Please try again.")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setError("")
    const egyptDate = getEgyptDate()
    setDate(egyptDate)
    setStore("")
    setTotalSales("")
    setPerfume("")
    setWatches("")
    setOriginalPerfumes("")
    setWallets("")
    setShowCategoryBreakdown(false)
    onEditCancel?.()
  }

  return (
    <Card className="shadow-2xl border-0 bg-slate-800 text-white sticky top-4 sm:top-6 lg:top-8">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-lg border-b-0">
        <CardTitle className="text-lg sm:text-xl">
          {editingId ? t(language, "editRecord") : t(language, "addSales")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 text-red-200 rounded-lg text-sm border border-red-700">{error}</div>
          )}

          {/* Store Selection */}
          <div className="space-y-2">
            <Label htmlFor="store" className="text-sm font-medium text-slate-200">
              {t(language, "store")} *
            </Label>
            <Select
              value={store}
              onValueChange={(value) => {
                setStore(value)
                setShowCategoryBreakdown(false)
              }}
            >
              <SelectTrigger id="store" className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder={t(language, "store")} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="Elhenawy">{t(language, "elhenawyStore")}</SelectItem>
                <SelectItem value="Konoz">{t(language, "konozStore")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-slate-200">
              {t(language, "dateEgyptTZ")} *
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Total Sales */}
          <div className="space-y-2">
            <Label htmlFor="totalSales" className="text-sm font-medium text-slate-200">
              {t(language, "totalSales")} *
            </Label>
            <Input
              id="totalSales"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={totalSales}
              onChange={(e) => setTotalSales(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Optional Category Breakdown Toggle */}
          {store === "Elhenawy" && (
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setShowCategoryBreakdown(!showCategoryBreakdown)}
                className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {showCategoryBreakdown ? t(language, "hideCategoryBreakdown") : t(language, "addCategoryBreakdown")}
              </button>

              {showCategoryBreakdown && (
                <div className="space-y-3 pt-3 bg-slate-700/50 p-3 rounded-lg">
                  <p className="text-xs text-slate-400">
                    {t(language, "categoryBreakdownNote")} {totalSales || "0.00"}
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="perfume" className="text-sm text-slate-200">
                      {t(language, "perfume")}
                    </Label>
                    <Input
                      id="perfume"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={perfume}
                      onChange={(e) => setPerfume(e.target.value)}
                      className="w-full bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="watches" className="text-sm text-slate-200">
                      {t(language, "watches")}
                    </Label>
                    <Input
                      id="watches"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={watches}
                      onChange={(e) => setWatches(e.target.value)}
                      className="w-full bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPerfumes" className="text-sm text-slate-200">
                      {t(language, "originalPerfumes")}
                    </Label>
                    <Input
                      id="originalPerfumes"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={originalPerfumes}
                      onChange={(e) => setOriginalPerfumes(e.target.value)}
                      className="w-full bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallets" className="text-sm text-slate-200">
                      {t(language, "wallets")}
                    </Label>
                    <Input
                      id="wallets"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={wallets}
                      onChange={(e) => setWallets(e.target.value)}
                      className="w-full bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
              {loading ? t(language, "saving") : editingId ? t(language, "update") : t(language, "save")}
            </Button>
            {editingId && (
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="flex-1 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
              >
                {t(language, "cancel")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
