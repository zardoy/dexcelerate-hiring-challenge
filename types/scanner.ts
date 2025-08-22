export interface TokenData {
  id: string
  tokenName: string
  tokenSymbol: string
  token0Symbol: string
  token1Symbol: string
  tokenAddress: string
  pairAddress: string
  chain: "ETH" | "SOL" | "BASE" | "BSC"
  exchange: string
  priceUsd: number
  volumeUsd: number
  mcap: number
  priceChangePcs: {
    "5m": number
    "1h": number
    "6h": number
    "24h": number
  }
  transactions: {
    buys: number
    sells: number
  }
  audit: {
    mintable: boolean
    freezable: boolean
    honeypot: boolean
    contractVerified: boolean
  }
  tokenCreatedTimestamp: Date | undefined
  liquidity: {
    current: number
    changePc: number
  }
}

export interface FilterState {
  chain: "ETH" | "SOL" | "BASE" | "BSC"
  minVolume: number
  maxAge: number
  minMcap: number
  excludeHoneypots: boolean
}

export interface ScannerApiResponse {
  data: {
    pairs: Array<{
      id: string
      tokenName: string
      tokenSymbol: string
      token0Symbol: string
      token1Symbol: string
      tokenAddress: string
      pairAddress: string
      chain: string
      router: string
      virtualRouter: string
      price: string
      volumeUsd: string
      currentMcap: string
      initialMcap: string
      pairMcapUsd: string
      pairMcapUsdInitial: string
      token1TotalSupplyFormatted: string
      token1Decimals: string
      diff5M: string | number
      diff1H: string | number
      diff6H: string | number
      diff24H: string | number
      buys: string | number
      sells: string | number
      tokenCreatedTimestamp: string
      liquidityUsd: string
      liquidityChangePc: string | number
      mintAuthorityRenounced: boolean
      freezeAuthorityRenounced: boolean
      token1IsHoneypot: boolean
      isVerified: boolean
    }>
  }
}

export interface WebSocketMessage {
  event: string
  data: any
}

export interface TickEvent {
  event: "tick"
  data: {
    swaps: Array<{
      priceToken1Usd: string
      isOutlier: boolean
      volumeUsd: string
      buys: string | number
      sells: string | number
    }>
    pairAddress: string
  }
}

export interface PairStatsEvent {
  event: "pair-stats"
  data: {
    pair: {
      mintAuthorityRenounced: boolean
      freezeAuthorityRenounced: boolean
      token1IsHoneypot: boolean
      isVerified: boolean
      linkDiscord?: string
      linkTelegram?: string
      linkTwitter?: string
      linkWebsite?: string
      dexPaid: boolean
    }
    migrationProgress: number
    pairAddress: string
  }
}
