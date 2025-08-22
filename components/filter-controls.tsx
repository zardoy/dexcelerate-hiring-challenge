"use client"

import { motion } from "framer-motion"
import type { FilterState } from "@/types/scanner"

interface FilterControlsProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterControls({ filters, onFiltersChange }: FilterControlsProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-600/30 shadow-2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Chain</label>
          <motion.select
            whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
            value={filters.chain}
            onChange={(e) => updateFilter("chain", e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white backdrop-blur-sm focus:border-blue-400 focus:outline-none transition-all duration-300"
          >
            <option value="SOL">🟣 Solana</option>
            <option value="ETH">🔷 Ethereum</option>
            <option value="BASE">🔵 Base</option>
            <option value="BSC">🟡 BSC</option>
          </motion.select>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Min Volume</label>
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)" }}
            type="number"
            value={filters.minVolume}
            onChange={(e) => updateFilter("minVolume", Number(e.target.value))}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white backdrop-blur-sm focus:border-emerald-400 focus:outline-none transition-all duration-300"
            placeholder="0"
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Max Age (hours)</label>
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)" }}
            type="number"
            value={filters.maxAge}
            onChange={(e) => updateFilter("maxAge", Number(e.target.value))}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white backdrop-blur-sm focus:border-amber-400 focus:outline-none transition-all duration-300"
            placeholder="24"
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <label className="block text-sm font-semibold mb-2 text-slate-300">Min Market Cap</label>
          <motion.input
            whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" }}
            type="number"
            value={filters.minMcap}
            onChange={(e) => updateFilter("minMcap", Number(e.target.value))}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white backdrop-blur-sm focus:border-purple-400 focus:outline-none transition-all duration-300"
            placeholder="0"
          />
        </motion.div>

        <motion.div
          className="flex items-end"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.label className="flex items-center cursor-pointer" whileTap={{ scale: 0.95 }}>
            <motion.input
              whileHover={{ scale: 1.1 }}
              type="checkbox"
              checked={filters.excludeHoneypots}
              onChange={(e) => updateFilter("excludeHoneypots", e.target.checked)}
              className="mr-3 w-5 h-5 text-red-400 bg-slate-700/50 border-slate-600/50 rounded focus:ring-red-400 focus:ring-2 transition-all duration-300"
            />
            <span className="text-sm font-medium text-slate-300">🍯 Exclude Honeypots</span>
          </motion.label>
        </motion.div>

        <motion.div
          className="flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              onFiltersChange({
                chain: "SOL",
                minVolume: 0,
                maxAge: 24,
                minMcap: 0,
                excludeHoneypots: true,
              })
            }
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold text-sm hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg"
          >
            🔄 Reset
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
