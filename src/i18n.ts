import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      invoices: 'Invoices',
      suppliers: 'Suppliers',
      tasks: 'Tasks',
      reconciliation: 'AI Reconciliation',
      clientPortal: 'Client Portal',
      quickCash: 'Quick Cash Handover',
      generatePdf: 'Generate PDF',
      quickPay: 'Quick Pay',
    },
  },
  ar: {
    translation: {
      dashboard: 'لوحة التحكم',
      invoices: 'الفواتير',
      suppliers: 'الموردون',
      tasks: 'المهام',
      reconciliation: 'تسوية الذكاء الاصطناعي',
      clientPortal: 'بوابة العميل',
      quickCash: 'تسليم نقدي سريع',
      generatePdf: 'إنشاء ملف PDF',
      quickPay: 'دفع سريع',
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
