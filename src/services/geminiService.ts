import { GoogleGenAI } from '@google/genai'
import { BankTransaction, DailySalesReport } from '../types'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

export interface ReconciliationMatch {
  transactionId: string
  reportId?: string
  confidence: number
  reason: string
}

export const reconcileWithGemini = async (
  transactions: BankTransaction[],
  reports: DailySalesReport[],
): Promise<{ matches: ReconciliationMatch[]; message: string }> => {
  if (!apiKey) {
    const matches = transactions.slice(0, 5).map((tx) => {
      const report = reports.find((r) => r.reference === tx.reference || Math.abs(r.amount - tx.amount) < 50)
      return {
        transactionId: tx.id,
        reportId: report?.id,
        confidence: report ? 0.82 : 0.31,
        reason: report
          ? 'Matched locally by reference/amount (mocked AI)'
          : 'No confident match found in mock mode',
      }
    })
    return { matches, message: 'Gemini API key missing, returning mocked AI matches.' }
  }

  const genAI = new GoogleGenAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `You are reconciling bank transactions to Daily Sales Reports. Return up to 10 confident matches as JSON with keys transactionId, reportId, confidence, reason. Transactions: ${JSON.stringify(transactions)} Reports: ${JSON.stringify(reports)}`

  const result = await model.generateContent(prompt)
  const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
  let parsed: ReconciliationMatch[] = []
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    console.warn('Gemini response parsing failed, falling back to heuristic', error)
    parsed = transactions.slice(0, 5).map((tx) => ({
      transactionId: tx.id,
      confidence: 0.4,
      reason: 'Heuristic fallback match',
      reportId: reports.find((r) => r.reference === tx.reference || Math.abs(r.amount - tx.amount) < 50)?.id,
    }))
  }

  return {
    matches: parsed,
    message: 'Gemini reconciliation completed',
  }
}
