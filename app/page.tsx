"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { t } from "@/lib/translations"
import type { Language } from "@/lib/translations"
import SalesForm from "@/components/sales-form"
import SalesTable from "@/components/sales-table"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function Home() {
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [view, setView] = useState<"dashboard" | "analytics">("dashboard")
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sales-language") as Language | null
    if (saved && (saved === "en" || saved === "ar")) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const htmlElement = document.documentElement
      htmlElement.lang = language
      htmlElement.dir = language === "ar" ? "rtl" : "ltr"
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("sales-language", lang)
  }

  const fetchSales = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "sales"), orderBy("date", "desc"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setSales(data)
    } catch (error) {
      console.error("Error fetching sales:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const handleSaleAdded = () => {
    setEditingId(null)
    fetchSales()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t(language, "deleteConfirm"))) return
    try {
      await deleteDoc(doc(db, "sales", id))
      fetchSales()
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Language Switcher */}
        <div className="mb-8 sm:mb-12 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 text-balance">
              {t(language, "salesDashboard")}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">{t(language, "trackManageAnalyze")}</p>
          </div>
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>

        {/* View Navigation */}
        <div className="flex gap-3 mb-8">
          <Button
            onClick={() => setView("dashboard")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              view === "dashboard"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200"
            }`}
          >
            {t(language, "dashboard")}
          </Button>
          <Button
            onClick={() => setView("analytics")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              view === "analytics"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200"
            }`}
          >
            {t(language, "analytics")}
          </Button>
        </div>

        {/* Analytics View */}
        {view === "analytics" ? (
          <AnalyticsDashboard sales={sales} language={language} />
        ) : (
          /* Dashboard View - Original Layout */
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {/* Form Section */}
            <div className="lg:col-span-1 xl:col-span-1">
              <SalesForm
                onSaleAdded={handleSaleAdded}
                editingId={editingId}
                editingData={sales.find((s) => s.id === editingId)}
                onEditCancel={() => setEditingId(null)}
                language={language}
              />
            </div>

            {/* Sales List Section */}
            <div className="lg:col-span-2 xl:col-span-3">
              <Card className="shadow-2xl border-0 bg-slate-800 text-white h-full">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-lg border-b-0">
                  <CardTitle className="text-lg sm:text-xl">{t(language, "recentSales")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <p className="text-center text-slate-400">{t(language, "loading")}</p>
                  ) : sales.length === 0 ? (
                    <p className="text-center text-slate-400">{t(language, "noRecords")}</p>
                  ) : (
                    <SalesTable sales={sales} onEdit={setEditingId} onDelete={handleDelete} language={language} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
