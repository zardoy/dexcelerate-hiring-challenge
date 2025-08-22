/**
 * Utility functions for safely parsing API response data
 */

/**
 * Safely parse a string to a number, returning 0 if invalid
 */
export function safeParseFloat(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;

  const parsed = Number.parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Safely parse a string to an integer, returning 0 if invalid
 */
export function safeParseInt(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return Math.floor(value);

  const parsed = Number.parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Safely parse a date string, returning current date if invalid
 */
export function safeParseDate(value: string | Date | null | undefined): Date | undefined {
  if (value === null || value === undefined) return new Date();
  if (value instanceof Date) return value;

  try {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) throw new Error('Invalid date');
    return parsed;
  } catch (err) {
    console.error('Error parsing date:', err, value);
    return undefined
  }
}

/**
 * Parse market cap with fallback logic
 */
export function parseMarketCap(data: {
  currentMcap: string | number;
  initialMcap: string | number;
  pairMcapUsd: string | number;
  pairMcapUsdInitial: string | number;
}): number {
  return (
    safeParseFloat(data.currentMcap) ||
    safeParseFloat(data.initialMcap) ||
    safeParseFloat(data.pairMcapUsd) ||
    safeParseFloat(data.pairMcapUsdInitial) ||
    0
  );
}

/**
 * Parse price change percentages, ensuring they are numbers
 */
export function parsePriceChanges(data: {
  diff5M: string | number;
  diff1H: string | number;
  diff6H: string | number;
  diff24H: string | number;
}): {
  "5m": number;
  "1h": number;
  "6h": number;
  "24h": number;
} {
  return {
    "5m": safeParseFloat(data.diff5M),
    "1h": safeParseFloat(data.diff1H),
    "6h": safeParseFloat(data.diff6H),
    "24h": safeParseFloat(data.diff24H),
  };
}

/**
 * Parse transaction counts, ensuring they are numbers
 */
export function parseTransactions(data: {
  buys: string | number;
  sells: string | number;
}): {
  buys: number;
  sells: number;
} {
  return {
    buys: safeParseInt(data.buys),
    sells: safeParseInt(data.sells),
  };
}

/**
 * Parse liquidity data, ensuring numbers
 */
export function parseLiquidity(data: {
  liquidityUsd: string | number;
  liquidityChangePc: string | number;
}): {
  current: number;
  changePc: number;
} {
  return {
    current: safeParseFloat(data.liquidityUsd),
    changePc: safeParseFloat(data.liquidityChangePc),
  };
}
