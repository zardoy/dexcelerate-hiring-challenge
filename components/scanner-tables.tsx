"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp } from "lucide-react"
import { TokenTable } from "./token-table"
import { FilterControls } from "./filter-controls"
import { useWebSocket } from "@/hooks/use-websocket"
import { useScannerData } from "@/hooks/use-scanner-data"
import type { FilterState } from "@/types/scanner"

export function ScannerTables() {
  const [filters, setFilters] = useState<FilterState>({
    chain: "SOL",
    minVolume: 0,
    maxAge: 24,
    minMcap: 0,
    excludeHoneypots: true,
  })

  const { trendingTokens, newTokens, loading, error, fetchData, updateTokenPrice, updateTokenStats } =
    useScannerData(filters)

  const { connected, subscribe, unsubscribe } = useWebSocket({
    onTick: updateTokenPrice,
    onPairStats: updateTokenStats,
    onScannerPairs: fetchData,
  })

  useEffect(() => {
    fetchData()
  }, [fetchData, filters])

  useEffect(() => {
    if (connected) {
      subscribe("scanner-filter", {
        rankBy: "volume",
        chain: filters.chain,
        isNotHP: filters.excludeHoneypots,
      })

      subscribe("scanner-filter", {
        rankBy: "age",
        chain: filters.chain,
        isNotHP: filters.excludeHoneypots,
      })
    }

    return () => {
      if (connected) {
        unsubscribe("scanner-filter", {
          rankBy: "volume",
          chain: filters.chain,
          isNotHP: filters.excludeHoneypots,
        })
        unsubscribe("scanner-filter", {
          rankBy: "age",
          chain: filters.chain,
          isNotHP: filters.excludeHoneypots,
        })
      }
    }
  }, [connected, filters, subscribe, unsubscribe])

  const filteredTrendingTokens = useMemo(() => {
    return trendingTokens.filter((token) => {
      if (token.volumeUsd < filters.minVolume) return false
      if (token.mcap < filters.minMcap) return false
      if (filters.excludeHoneypots && token.audit.honeypot) return false
      if (!token.tokenCreatedTimestamp) return false

      const ageHours = (Date.now() - new Date(token.tokenCreatedTimestamp).getTime()) / (1000 * 60 * 60)
      if (ageHours > filters.maxAge) return false

      return true
    })
  }, [trendingTokens, filters])

  const filteredNewTokens = useMemo(() => {
    return newTokens.filter((token) => {
      if (token.volumeUsd < filters.minVolume) return false
      if (token.mcap < filters.minMcap) return false
      if (filters.excludeHoneypots && token.audit.honeypot) return false
      if (!token.tokenCreatedTimestamp) return false

      const ageHours = (Date.now() - new Date(token.tokenCreatedTimestamp).getTime()) / (1000 * 60 * 60)
      if (ageHours > filters.maxAge) return false

      return true
    })
  }, [newTokens, filters])

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
        <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-red-400 mb-4">Error loading data: {error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchData()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Retry
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 min-h-screen bg-gradient-to-br from-blue-600/5 via-blue-800/5 to-slate-900/5 w-full px-0 sm:px-4 md:px-6 lg:px-8"
    >
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <FilterControls filters={filters} onFiltersChange={setFilters} />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[600px] lg:min-h-[800px] w-full">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <motion.h2
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Trending Tokens
            </div>
          </motion.h2>
          <TokenTable
            tokens={filteredTrendingTokens}
            loading={loading}
            sortBy="volume"
            onSubscribePairStats={(token) => {
              if (connected) {
                subscribe("pair-stats", {
                  pair: token.pairAddress,
                  token: token.tokenAddress,
                  chain: token.chain,
                })
              }
            }}
          />
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <motion.h2
            className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-green-400" />
              New Tokens
            </div>
          </motion.h2>
          <TokenTable
            tokens={filteredNewTokens}
            loading={loading}
            sortBy="age"
            onSubscribePairStats={(token) => {
              if (connected) {
                subscribe("pair-stats", {
                  pair: token.pairAddress,
                  token: token.tokenAddress,
                  chain: token.chain,
                })
              }
            }}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-center"
      >
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{
              scale: connected ? [1, 1.2, 1] : 1,
              opacity: connected ? [0.5, 1, 0.5] : 0.3,
            }}
            transition={{
              duration: 2,
              repeat: connected ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
            className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}
          />
          <span className={connected ? "text-green-400" : "text-red-400"}>
            WebSocket: {connected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="text-slate-400 text-sm space-y-2">
          <p className="font-medium">© @zardoy 2025. All rights reserved.</p>
          <p>This software is provided for educational and non-commercial use only.</p>
          <p>Commercial use is strictly prohibited without explicit permission.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
