import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  value: string
  hint?: string
  accent?: string
}

export const StatCard: React.FC<Props> = ({ title, value, hint, accent }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="card-surface rounded-2xl p-4 shadow-card"
    style={{ borderTop: `3px solid ${accent ?? 'var(--accent)'}` }}
  >
    <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{title}</p>
    <p className="text-2xl font-semibold mt-1">{value}</p>
    {hint && <p className="text-xs text-[var(--muted)] mt-1">{hint}</p>}
  </motion.div>
)
