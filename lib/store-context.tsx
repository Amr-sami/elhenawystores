"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface StoreContextType {
  store: string
  setStore: (store: string) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStoreState] = useState<string>("All")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sales-store")
    if (saved) {
      setStoreState(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sales-store", store)
    }
  }, [store, mounted])

  const setStore = (s: string) => {
    setStoreState(s)
  }

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return context
}
