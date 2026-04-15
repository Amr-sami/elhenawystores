export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    analytics: "Analytics",
    settings: "Settings",
    management: "Management",
    quickActions: "Quick Actions",
    executiveSummary: "Executive Summary",

    // Header
    salesDashboard: "Sales Dashboard",
    trackManageAnalyze: "Track, manage, and analyze sales across your stores",

    // Form Labels
    addSales: "Add Sales",
    editRecord: "Edit Record",
    store: "Store",
    storeRequired: "Store",
    date: "Date",
    dateEgyptTZ: "Date (Egypt Timezone)",
    totalSales: "Total Sales",
    categoryBreakdown: "Category Breakdown",
    addCategoryBreakdown: "Add Category Breakdown (Optional)",
    hideCategoryBreakdown: "Hide Category Breakdown (Optional)",
    categoryBreakdownNote: "Totals must equal",
    perfume: "Perfume",
    watches: "Watches",
    originalPerfumes: "Original Perfumes",
    wallets: "Wallets",
    save: "Save",
    update: "Update",
    cancel: "Cancel",
    saving: "Saving...",

    // Store Names
    elhenawyStore: "Elhenawy Store",
    konozStore: "Konoz Store",

    // Table
    recentSales: "Recent Sales",
    totalSalesHeader: "Total Sales",
    categories: "Categories",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    noRecords: "No sales records yet. Add one to get started!",
    loading: "Loading...",

    // Messages
    fillAllFields: "Please fill in all required fields",
    categoryMismatch:
      "Category breakdown total ({total}) must equal total sales ({sales})",
    failedToSave: "Failed to save sales data. Please try again.",
    deleteConfirm: "Are you sure you want to delete this record?",
    recordDeleted: "Record deleted successfully",

    // Analytics
    storeFilter: "Store Filter",
    timeRange: "Time Range",
    allStores: "All Stores",
    week: "Week",
    month: "Month",
    quarter: "Quarter",
    year: "Year",
    custom: "Custom",
    storeComparison: "Store Comparison",
    monthlyTrend: "Monthly Trend",
    categoryDistribution: "Category Distribution",
    totalSalesAnalytics: "Total Sales",
    averageSalesAnalytics: "Average Sales",
    transactionCount: "Transactions",
    categoryBreakdownAnalytics: "Category Breakdown",
    selectDateRange: "Select Date Range",
    from: "From",
    to: "To",
    apply: "Apply",

    // Language
    language: "Language",
    english: "English",
    arabic: "العربية",
    accessManagement: "Access Management",
    enterPassword: "Enter Management Password",
    unlock: "Unlock Analytics",
    invalidPassword: "Incorrect password. Please try again.",
  },
  ar: {
    // ... items would be down there but I need to do both
    // Navigation
    dashboard: "لوحة التحكم",
    analytics: "التحليلات",
    settings: "الإعدادات",
    management: "الإدارة",
    quickActions: "إجراءات سريعة",
    executiveSummary: "الملخص التنفيذي",

    // Header
    salesDashboard: "لوحة مبيعات المتاجر",
    trackManageAnalyze: "تتبع وإدارة وتحليل المبيعات عبر متاجرك",

    // Form Labels
    addSales: "إضافة مبيعات",
    editRecord: "تعديل السجل",
    store: "المتجر",
    storeRequired: "المتجر",
    date: "التاريخ",
    dateEgyptTZ: "التاريخ (منطقة مصر الزمنية)",
    totalSales: "إجمالي المبيعات",
    categoryBreakdown: "تفاصيل الفئات",
    addCategoryBreakdown: "إضافة تفاصيل الفئات (اختياري)",
    hideCategoryBreakdown: "إخفاء تفاصيل الفئات (اختياري)",
    categoryBreakdownNote: "يجب أن يساوي المجموع",
    perfume: "العطور",
    watches: "الساعات",
    originalPerfumes: "العطور الأصلية",
    wallets: "المحافظ",
    save: "حفظ",
    update: "تحديث",
    cancel: "إلغاء",
    saving: "جاري الحفظ...",

    // Store Names
    elhenawyStore: "متجر الحناوي",
    konozStore: "متجر كنوز",

    // Table
    recentSales: "آخر المبيعات",
    totalSalesHeader: "إجمالي المبيعات",
    categories: "الفئات",
    actions: "الإجراءات",
    edit: "تعديل",
    delete: "حذف",
    noRecords: "لا توجد سجلات مبيعات حتى الآن. أضف واحدة للبدء!",
    loading: "جاري التحميل...",

    // Messages
    fillAllFields: "يرجى ملء جميع الحقول المطلوبة",
    categoryMismatch:
      "يجب أن يساوي مجموع الفئات ({total}) إجمالي المبيعات ({sales})",
    failedToSave: "فشل حفظ بيانات المبيعات. يرجى المحاولة مرة أخرى.",
    deleteConfirm: "هل أنت متأكد من رغبتك في حذف هذا السجل؟",
    recordDeleted: "تم حذف السجل بنجاح",

    // Analytics
    storeFilter: "تصفية المتجر",
    timeRange: "نطاق الوقت",
    allStores: "جميع المتاجر",
    week: "أسبوع",
    month: "شهر",
    quarter: "ربع سنة",
    year: "سنة",
    custom: "مخصص",
    storeComparison: "مقارنة المتاجر",
    monthlyTrend: "الاتجاه الشهري",
    categoryDistribution: "توزيع الفئات",
    totalSalesAnalytics: "إجمالي المبيعات",
    averageSalesAnalytics: "متوسط المبيعات",
    transactionCount: "عدد العمليات",
    categoryBreakdownAnalytics: "تفصيل الفئات",
    selectDateRange: "حدد نطاق التاريخ",
    from: "من",
    to: "إلى",
    apply: "تطبيق",

    // Language
    language: "اللغة",
    english: "English",
    arabic: "العربية",
    accessManagement: "إدارة الوصول",
    enterPassword: "أدخل كلمة مرور الإدارة",
    unlock: "فتح التحليلات",
    invalidPassword: "كلمة مرور غير صحيحة. حاول مرة أخرى.",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export const t = (lang: Language, key: TranslationKey): string => {
  return translations[lang][key] || key
}
