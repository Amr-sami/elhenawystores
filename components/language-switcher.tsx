"use client"

import { Button } from "@/components/ui/button"
import type { Language } from "@/lib/translations"

interface LanguageSwitcherProps {
  language: Language
  setLanguage: (lang: Language) => void
}

export function LanguageSwitcher({ language, setLanguage }: LanguageSwitcherProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => setLanguage("en")}
        className={`px-3 sm:px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
          language === "en"
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-slate-700 hover:bg-slate-600 text-slate-200"
        }`}
      >
        EN
      </Button>
      <Button
        onClick={() => setLanguage("ar")}
        className={`px-3 sm:px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
          language === "ar"
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-slate-700 hover:bg-slate-600 text-slate-200"
        }`}
      >
        العربية
      </Button>
    </div>
  )
}
