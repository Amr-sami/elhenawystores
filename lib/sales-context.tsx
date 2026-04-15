"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { collection, query, orderBy, getDocs, deleteDoc, doc, Timestamp, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Sale {
  id: string
  store: string
  date: Timestamp | Date
  totalSales: number
  perfume?: number
  watches?: number
  originalPerfumes?: number
  wallets?: number
  timestamp?: Timestamp
}

interface SalesContextType {
  sales: Sale[]
  loading: boolean
  fetchSales: () => Promise<void>
  deleteSale: (id: string) => Promise<void>
}

const SalesContext = createContext<SalesContextType | undefined>(undefined)

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSales = useCallback(async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "sales"), orderBy("date", "desc"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sale[]
      setSales(data)
    } catch (error) {
      console.error("Error fetching sales:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Real-time synchronization
    const q = query(collection(db, "sales"), orderBy("date", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sale[]
      setSales(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const deleteSale = async (id: string) => {
    try {
      await deleteDoc(doc(db, "sales", id))
    } catch (error) {
      console.error("Error deleting:", error)
      throw error
    }
  }

  return (
    <SalesContext.Provider value={{ sales, loading, fetchSales, deleteSale }}>
      {children}
    </SalesContext.Provider>
  )
}

export function useSales() {
  const context = useContext(SalesContext)
  if (!context) {
    throw new Error("useSales must be used within SalesProvider")
  }
  return context
}
