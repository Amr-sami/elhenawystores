"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Language } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sales-language") as Language | null
    if (saved && (saved === "en" || saved === "ar")) {
      setLanguageState(saved)
    } else {
      setLanguageState("en")
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

  if (!mounted) {
    return <>{children}</>
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
