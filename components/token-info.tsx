"use client"

import { motion } from "framer-motion"
import { ExternalLink, Twitter, Globe, MessageCircle } from "lucide-react"
import type { TokenData } from "@/types/scanner"

interface TokenInfoProps {
  token: TokenData
}

export function TokenInfo({ token }: TokenInfoProps) {
    // Get token logo from Dextools API using token0Name for better image results
  const getTokenLogo = (chain: string, token0Name: string) => {
    const chainMap: Record<string, string> = {
      ETH: "ether",
      SOL: "solana",
      BASE: "base",
      BSC: "bsc"
    }
    const chainSlug = chainMap[chain] || "ether"
    // Use token0Name instead of address for better logo matching
    return `https://www.dextools.io/resources/tokens/logos/${chainSlug}/${token0Name}`
  }

  // Generate social links using only real data from pair stats
  const getSocialLinks = (chain: string) => {
    const baseUrl = "https://dexscreener.com"
    return {
      dexscreener: `${baseUrl}/${chain.toLowerCase()}/${token.pairAddress || "unknown"}`,
      // Only show social links if they exist in the token data
      twitter: token.socialLinks?.twitter || undefined,
      website: token.socialLinks?.website || undefined,
      telegram: token.socialLinks?.telegram || undefined,
      discord: token.socialLinks?.discord || undefined
    }
  }

  const socialLinks = getSocialLinks(token.chain || "ETH")
  const tokenLogo = getTokenLogo(token.chain || "ETH", token.token0Symbol || "ETH")

    return (
    <div className="flex items-center space-x-3">
      {/* Token Logo */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600/50"
      >
        <img
          src={tokenLogo}
          alt={token.tokenName || "Token Logo"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as unknown as HTMLImageElement
            target.src = "/placeholder-logo.png"
          }}
        />
      </motion.div>

      {/* Token Info and Social Links on same line */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <div>
            <div className="font-bold text-white truncate">{token.tokenName || "Unknown Token"}</div>
            <div className="text-slate-400 text-xs">
              {token.token0Symbol || "?"}/{token.token1Symbol || "?"}
            </div>
          </div>

                    {/* Social Links */}
          <div className="flex items-center space-x-2 ml-4">
            <motion.a
              href={socialLinks.dexscreener}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: "#3b82f6" }}
              className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
              title="View on DexScreener"
            >
              <ExternalLink className="w-4 h-4 text-slate-300" />
            </motion.a>

            {socialLinks.twitter && (
              <motion.a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ color: "#1da1f2" }}
                className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4 text-slate-300" />
              </motion.a>
            )}

            {socialLinks.website && (
              <motion.a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ color: "#10b981" }}
                className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                title="Website"
              >
                <Globe className="w-4 h-4 text-slate-300" />
              </motion.a>
            )}

            {socialLinks.telegram && (
              <motion.a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ color: "#0088cc" }}
                className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                title="Telegram"
              >
                <MessageCircle className="w-4 h-4 text-slate-300" />
              </motion.a>
            )}

            {socialLinks.discord && (
              <motion.a
                href={socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ color: "#5865f2" }}
                className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                title="Discord"
              >
                <MessageCircle className="w-4 h-4 text-slate-300" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
