/**
 * Simple test file for parse utilities
 * Run with: npx tsx lib/parse-utils.test.ts
 */

import {
  safeParseFloat,
  safeParseInt,
  safeParseDate,
  parseMarketCap,
  parsePriceChanges,
  parseTransactions,
  parseLiquidity
} from './parse-utils';

// Test safeParseFloat
console.log('🧪 Testing safeParseFloat:');
console.log('safeParseFloat("123.45") =', safeParseFloat("123.45"));
console.log('safeParseFloat("invalid") =', safeParseFloat("invalid"));
console.log('safeParseFloat(null) =', safeParseFloat(null));
console.log('safeParseFloat(undefined) =', safeParseFloat(undefined));
console.log('safeParseFloat(123.45) =', safeParseFloat(123.45));

// Test safeParseInt
console.log('\n🧪 Testing safeParseInt:');
console.log('safeParseInt("123") =', safeParseInt("123"));
console.log('safeParseInt("invalid") =', safeParseInt("invalid"));
console.log('safeParseInt(null) =', safeParseInt(null));
console.log('safeParseInt(123.45) =', safeParseInt(123.45));

// Test parseMarketCap
console.log('\n🧪 Testing parseMarketCap:');
const marketCapData = {
  currentMcap: "1000000",
  initialMcap: "500000",
  pairMcapUsd: "750000",
  pairMcapUsdInitial: "250000"
};
console.log('parseMarketCap(data) =', parseMarketCap(marketCapData));

// Test parsePriceChanges
console.log('\n🧪 Testing parsePriceChanges:');
const priceChangeData = {
  diff5M: "5.5",
  diff1H: "10.2",
  diff6H: "-2.1",
  diff24H: "25.0"
};
console.log('parsePriceChanges(data) =', parsePriceChanges(priceChangeData));

// Test parseTransactions
console.log('\n🧪 Testing parseTransactions:');
const transactionData = {
  buys: "150",
  sells: "75"
};
console.log('parseTransactions(data) =', parseTransactions(transactionData));

// Test parseLiquidity
console.log('\n🧪 Testing parseLiquidity:');
const liquidityData = {
  liquidityUsd: "50000",
  liquidityChangePc: "12.5"
};
console.log('parseLiquidity(data) =', parseLiquidity(liquidityData));

// Test safeParseDate
console.log('\n🧪 Testing safeParseDate:');
console.log('safeParseDate("2025-08-22T14:47:06Z") =', safeParseDate("2025-08-22T14:47:06Z"));
console.log('safeParseDate("invalid") =', safeParseDate("invalid"));
console.log('safeParseDate(null) =', safeParseDate(null));
console.log('safeParseDate(new Date()) =', safeParseDate(new Date()));

console.log('\n✅ All tests completed!');
