"use client"

import { useState, useCallback, useRef } from "react"
import type { TokenData, FilterState, ScannerApiResponse, TickEvent, PairStatsEvent } from "@/types/scanner"
import { apiWrapper } from "@/lib/api-wrapper"
import {
  safeParseFloat,
  safeParseInt,
  safeParseDate,
  parseMarketCap,
  parsePriceChanges,
  parseTransactions,
  parseLiquidity
} from "@/lib/parse-utils"

// Helper function to convert chain ID to chain name
const getChainFromId = (chainId: number): TokenData["chain"] => {
  switch (chainId) {
    case 1: return "ETH"
    case 56: return "BSC"
    case 8453: return "BASE"
    case 1399811150: return "SOL" // Solana mainnet
    case 900: return "SOL" // Solana testnet
    default: return "ETH"
  }
}

export function useScannerData(filters: FilterState) {
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([])
  const [newTokens, setNewTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const tokenMapRef = useRef<Map<string, TokenData>>(new Map())

  const transformApiData = useCallback((apiData: ScannerApiResponse["data"]["pairs"]): TokenData[] => {
    return apiData.map((pair) => {
      const token: TokenData = {
        id: pair.pairAddress,
        tokenName: pair.token1Name,
        tokenSymbol: pair.token1Symbol,
        token0Symbol: pair.token0Symbol,
        token1Symbol: pair.token1Symbol,
        tokenAddress: pair.token1Address,
        pairAddress: pair.pairAddress,
        chain: getChainFromId(pair.chainId),
        exchange: pair.routerAddress || "No Router",
        priceUsd: safeParseFloat(pair.price),
        volumeUsd: safeParseFloat(pair.volume),
        mcap: parseMarketCap({
          currentMcap: pair.currentMcap,
          initialMcap: pair.initialMcap,
          pairMcapUsd: pair.pairMcapUsd,
          pairMcapUsdInitial: pair.pairMcapUsdInitial,
        }),
        priceChangePcs: parsePriceChanges({
          diff5M: pair.diff5M || 0,
          diff1H: pair.diff1H || 0,
          diff6H: pair.diff6H || 0,
          diff24H: pair.diff24H || 0,
        }),
        transactions: parseTransactions({
          buys: pair.buys,
          sells: pair.sells,
        }),
        audit: {
          mintable: !pair.isMintAuthDisabled,
          freezable: !pair.isFreezeAuthDisabled,
          honeypot: pair.honeyPot,
          contractVerified: pair.contractVerified,
        },
        socialLinks: {
          discord: pair.discordLink || undefined,
          telegram: pair.telegramLink || undefined,
          twitter: pair.twitterLink || undefined,
          website: pair.webLink || undefined,
        },
        tokenCreatedTimestamp: safeParseDate(pair.age),
        liquidity: parseLiquidity({
          liquidityUsd: pair.liquidity,
          liquidityChangePc: pair.percentChangeInLiquidity,
        }),
      }

      tokenMapRef.current.set(pair.pairAddress, token)
      return token
    })
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [trendingData, newData]: [ScannerApiResponse, ScannerApiResponse] = await Promise.all([
        apiWrapper.fetchScannerData({
          rankBy: 'volume',
          chain: filters.chain,
          isNotHP: filters.excludeHoneypots,
          limit: 100
        }),
        apiWrapper.fetchScannerData({
          rankBy: 'age',
          chain: filters.chain,
          isNotHP: filters.excludeHoneypots,
          limit: 100
        })
      ])

      // Development-only logging
      if (process.env.NODE_ENV === 'development') {
        console.log('trendingData', trendingData)
        console.log('Sample pair data:', trendingData.data.pairs[0])
      }

      const transformedTrending = transformApiData(trendingData.data.pairs)
      const transformedNew = transformApiData(newData.data.pairs)

      setTrendingTokens(transformedTrending)
      setNewTokens(transformedNew)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [filters, transformApiData])

  const updateTokenPrice = useCallback((tickData: TickEvent["data"]) => {
    const validSwaps = tickData.swaps.filter((swap) => !swap.isOutlier)
    if (validSwaps.length === 0) return

    const latestSwap = validSwaps[validSwaps.length - 1]
    const newPrice = safeParseFloat(latestSwap.priceToken1Usd)
    const token = tokenMapRef.current.get(tickData.pairAddress)

    if (!token) return

    const totalSupply = token.mcap / token.priceUsd
    const newMarketCap = totalSupply * newPrice

    const updatedToken: TokenData = {
      ...token,
      priceUsd: newPrice,
      mcap: newMarketCap,
      volumeUsd: safeParseFloat(latestSwap.volumeUsd),
      transactions: {
        buys: safeParseInt(latestSwap.buys),
        sells: safeParseInt(latestSwap.sells),
      },
    }

    tokenMapRef.current.set(tickData.pairAddress, updatedToken)

    setTrendingTokens((prev) => prev.map((t) => (t.pairAddress === tickData.pairAddress ? updatedToken : t)))
    setNewTokens((prev) => prev.map((t) => (t.pairAddress === tickData.pairAddress ? updatedToken : t)))
  }, [])

  const updateTokenStats = useCallback((statsData: PairStatsEvent["data"]) => {
    const token = tokenMapRef.current.get(statsData.pairAddress)
    if (!token) return

    const updatedToken: TokenData = {
      ...token,
      audit: {
        ...token.audit,
        mintable: !statsData.pair.mintAuthorityRenounced,
        freezable: !statsData.pair.freezeAuthorityRenounced,
        honeypot: statsData.pair.token1IsHoneypot,
        contractVerified: statsData.pair.isVerified,
      },
      socialLinks: {
        discord: statsData.pair.linkDiscord,
        telegram: statsData.pair.linkTelegram,
        twitter: statsData.pair.linkTwitter,
        website: statsData.pair.linkWebsite,
      },
    }

    tokenMapRef.current.set(statsData.pairAddress, updatedToken)

    setTrendingTokens((prev) => prev.map((t) => (t.pairAddress === statsData.pairAddress ? updatedToken : t)))
    setNewTokens((prev) => prev.map((t) => (t.pairAddress === statsData.pairAddress ? updatedToken : t)))
  }, [])

  return {
    trendingTokens,
    newTokens,
    loading,
    error,
    fetchData,
    updateTokenPrice,
    updateTokenStats,
  }
}
