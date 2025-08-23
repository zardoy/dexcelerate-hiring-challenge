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
  socialLinks?: {
    discord?: string
    telegram?: string
    twitter?: string
    website?: string
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
      token0Symbol: string
      token1Symbol: string
      token1Name: string
      token1Address: string
      chainId: number
      routerAddress: string
      age: string
      pairAddress: string
      price: string
      volume: string
      first5M: string | number | null
      first1H: string | number | null
      first6H: string | number | null
      first24H: string | number | null
      diff5M: string | number | null
      diff1H: string | number | null
      diff6H: string | number | null
      diff24H: string | number | null
      liquidity: string
      fdv: string
      makers: number
      txns: number
      buys: number
      sells: number
      buyFee: number
      sellFee: number
      currentMcap: string
      initialMcap: string
      percentChangeInMcap: string
      contractRenounced: boolean
      contractVerified: boolean
      liquidityLocked: boolean
      liquidityLockedRatio: string
      liquidityLockedAmount: string | null
      isMintAuthDisabled: boolean
      isFreezeAuthDisabled: boolean
      honeyPot: boolean
      percentChangeInLiquidity: string
      pairMcapUsd: string
      pairMcapUsdInitial: string
      twitterLink: string | null
      telegramLink: string | null
      discordLink: string | null
      webLink: string | null
      token1TotalSupplyFormatted: string
      token1Decimals: number
      token1ImageUri: string | null
      reserves0: string
      reserves1: string
      reserves0Usd: string
      reserves1Usd: string
      token0Decimals: number
      migratedFromPairAddress: string | null
      migratedFromRouterAddress: string | null
      callCount: number
      migrationProgress: string | null
      dexPaid: boolean
      devHoldings: string
      token1DevWalletToTotalSupplyRatio: string
      insiders: number
      insiderHoldings: string
      token1InsiderWalletToTotalSupplyRatio: string
      bundlers: number
      bundlerHoldings: string
      token1BundlerWalletToTotalSupplyRatio: string | null
      snipers: number
      sniperHoldings: string
      token1SniperWalletToTotalSupplyRatio: string | null
      traders: number
      traderHoldings: string
      token1TraderWalletToTotalSupplyRatio: string
      top10Holdings: string
      token1Top10ToTotalSupplyRatio: string
      migratedFromVirtualRouter: string | null
      virtualRouterType: string | null
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
