"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { TokenData } from "@/types/scanner"

const formatShortTimeAgo = (date: Date) => {
  try {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInDays < 7) return `${diffInDays}d`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}w`

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) return `${diffInMonths}mo`

    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears}y`
  } catch (err) {
    return 'N/A'
  }
}

interface TokenTableProps {
  tokens: TokenData[]
  loading: boolean
  sortBy: "volume" | "age"
  onSubscribePairStats: (token: TokenData) => void
}

export function TokenTable({ tokens, loading, sortBy, onSubscribePairStats }: TokenTableProps) {
  const [sortField, setSortField] = useState<keyof TokenData>(
    sortBy === "volume" ? "volumeUsd" : "tokenCreatedTimestamp",
  )
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    tokens.forEach((token) => {
      onSubscribePairStats(token)
    })
  }, [tokens, onSubscribePairStats])

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === "tokenCreatedTimestamp") {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }, [tokens, sortField, sortDirection])

  const handleSort = (field: keyof TokenData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const formatPrice = (price: number) => {
    if (price < 0.001) return `$${price.toExponential(2)}`
    return `$${price.toFixed(6)}`
  }

  const formatMcap = (mcap: number) => {
    if (mcap >= 1e9) return `$${(mcap / 1e9).toFixed(2)}B`
    if (mcap >= 1e6) return `$${(mcap / 1e6).toFixed(2)}M`
    if (mcap >= 1e3) return `$${(mcap / 1e3).toFixed(2)}K`
    return `$${mcap.toFixed(2)}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(2)}`
  }

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-400"
    if (change < 0) return "text-red-400"
    return "text-gray-400"
  }

  if (loading && tokens.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 text-center border border-slate-700/50"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full mx-auto"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-slate-400 font-medium"
        >
          Scanning the blockchain...
        </motion.p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl"
    >
      <div className="overflow-x-auto overflow-y-auto h-full min-w-0">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm sticky top-0">
            <tr>
              <motion.th
                whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.8)" }}
                className="px-4 py-3 text-left cursor-pointer transition-colors duration-200"
                onClick={() => handleSort("tokenName")}
              >
                <span className="text-slate-300 font-semibold">Token</span>
              </motion.th>
              <motion.th
                whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.8)" }}
                className="px-4 py-3 text-left cursor-pointer transition-colors duration-200"
                onClick={() => handleSort("exchange")}
              >
                <span className="text-slate-300 font-semibold">Exchange</span>
              </motion.th>
              <motion.th
                whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.8)" }}
                className="px-4 py-3 text-right cursor-pointer transition-colors duration-200"
                onClick={() => handleSort("priceUsd")}
              >
                <span className="text-slate-300 font-semibold">Price</span>
              </motion.th>
              <motion.th
                whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.8)" }}
                className="px-4 py-3 text-right cursor-pointer transition-colors duration-200"
                onClick={() => handleSort("mcap")}
              >
                <span className="text-slate-300 font-semibold">Market Cap</span>
              </motion.th>
              <motion.th
                whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.8)" }}
                className="px-4 py-3 text-right cursor-pointer transition-colors duration-200"
                onClick={() => handleSort("volumeUsd")}
              >
                <span className="text-slate-300 font-semibold">Volume 24h</span>
              </motion.th>
              <th className="px-4 py-3 text-right text-slate-300 font-semibold">5m</th>
              <th className="px-4 py-3 text-right text-slate-300 font-semibold">1h</th>
              <th className="px-4 py-3 text-right text-slate-300 font-semibold">6h</th>
              <th className="px-4 py-3 text-right text-slate-300 font-semibold">24h</th>
              <motion.th
                whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.8)" }}
                className="px-4 py-3 text-right cursor-pointer transition-colors duration-200"
                onClick={() => handleSort("tokenCreatedTimestamp")}
              >
                <span className="text-slate-300 font-semibold">Age</span>
              </motion.th>
              <th className="px-4 py-3 text-right text-slate-300 font-semibold">Buys/Sells</th>
              <th className="px-4 py-3 text-right text-slate-300 font-semibold">Liquidity</th>
              <th className="px-4 py-3 text-center text-slate-300 font-semibold">Audit</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedTokens.map((token, index) => (
                <motion.tr
                  key={token.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{
                    backgroundColor: "rgba(51, 65, 85, 0.3)",
                    scale: 1.01,
                  }}
                  className="border-t border-slate-700/30 transition-all duration-200"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold text-white">{token.tokenName}</div>
                      <div className="text-slate-400 text-xs">
                        {token.token0Symbol}/{token.token1Symbol} • {token.chain}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{token.exchange}</td>
                  <td className="px-4 py-3 text-right font-mono text-white">{formatPrice(token.priceUsd)}</td>
                  <td className="px-4 py-3 text-right font-mono text-white">{formatMcap(token.mcap)}</td>
                  <td className="px-4 py-3 text-right font-mono text-white">{formatVolume(token.volumeUsd)}</td>
                  <motion.td
                    whileHover={{ scale: 1.1 }}
                    className={`px-4 py-3 text-right font-mono font-bold ${getPriceChangeColor(token.priceChangePcs["5m"])}`}
                  >
                    {token.priceChangePcs["5m"] > 0 ? "+" : ""}
                    {token.priceChangePcs["5m"].toFixed(1)}%
                  </motion.td>
                  <motion.td
                    whileHover={{ scale: 1.1 }}
                    className={`px-4 py-3 text-right font-mono font-bold ${getPriceChangeColor(token.priceChangePcs["1h"])}`}
                  >
                    {token.priceChangePcs["1h"] > 0 ? "+" : ""}
                    {token.priceChangePcs["1h"].toFixed(1)}%
                  </motion.td>
                  <motion.td
                    whileHover={{ scale: 1.1 }}
                    className={`px-4 py-3 text-right font-mono font-bold ${getPriceChangeColor(token.priceChangePcs["6h"])}`}
                  >
                    {token.priceChangePcs["6h"] > 0 ? "+" : ""}
                    {token.priceChangePcs["6h"].toFixed(1)}%
                  </motion.td>
                  <motion.td
                    whileHover={{ scale: 1.1 }}
                    className={`px-4 py-3 text-right font-mono font-bold ${getPriceChangeColor(token.priceChangePcs["24h"])}`}
                  >
                    {token.priceChangePcs["24h"] > 0 ? "+" : ""}
                    {token.priceChangePcs["24h"].toFixed(1)}%
                  </motion.td>
                  <td className="px-4 py-3 text-right text-slate-300">
                    {token.tokenCreatedTimestamp ? formatShortTimeAgo(token.tokenCreatedTimestamp) : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <motion.div whileHover={{ scale: 1.05 }} className="text-emerald-400 font-semibold">
                      {token.transactions.buys}
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="text-red-400 font-semibold">
                      {token.transactions.sells}
                    </motion.div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-mono text-white">{formatVolume(token.liquidity.current)}</div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`text-xs font-semibold ${getPriceChangeColor(token.liquidity.changePc)}`}
                    >
                      {token.liquidity.changePc > 0 ? "+" : ""}
                      {token.liquidity.changePc.toFixed(1)}%
                    </motion.div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-center">
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 180 }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${token.audit.contractVerified ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-slate-600"}`}
                        title="Verified"
                      />
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 180 }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${token.audit.mintable ? "bg-red-400 shadow-lg shadow-red-400/50" : "bg-emerald-400 shadow-lg shadow-emerald-400/50"}`}
                        title="Mintable"
                      />
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 180 }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${token.audit.freezable ? "bg-red-400 shadow-lg shadow-red-400/50" : "bg-emerald-400 shadow-lg shadow-emerald-400/50"}`}
                        title="Freezable"
                      />
                      <motion.div
                        whileHover={{ scale: 1.3, rotate: 180 }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${token.audit.honeypot ? "bg-red-400 shadow-lg shadow-red-400/50" : "bg-emerald-400 shadow-lg shadow-emerald-400/50"}`}
                        title="Honeypot"
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
