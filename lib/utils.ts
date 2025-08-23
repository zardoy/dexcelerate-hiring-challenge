import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SMALL_SCREEN_MEDIA = '@media (max-width: 768px)' as const

// export const useIsMobile = () => {
//     return useMedia(SMALL_SCREEN_MEDIA.replace('@media ', ''))
// }

export const clampAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`
export const clampAddressMax = (address: string) => `${address.slice(0, 4)}...${address.slice(-2)}`

export const formatWei = x => {
    if (typeof x === 'bigint') return (x / 10n ** 18n) as any
    return (x * 10 ** 18) as any
}

export const formatEth = x => x / 10 ** 18

export const formatNumber = (value: string | number | undefined, digits = 2) => {
  if (!value && value !== 0 && value !== '0') return '-'
  try {
      const number = Number(value)
      if (isNaN(number)) return '-'
      return Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: digits,
      }).format(number)
  } catch {
      return '-'
  }
}

const getSubNumberString = (num: number) => {
  const subNumberStrings = {
      0: '₀',
      1: '₁',
      2: '₂',
      3: '₃',
      4: '₄',
      5: '₅',
      6: '₆',
      7: '₇',
      8: '₈',
      9: '₉',
  }

  let result = ''
  for (const s of num.toString()) {
      result += subNumberStrings[s] as string
  }

  return result
}

export const formatSmallNumber = (num: number | undefined) => {
  if (num === undefined) return '-'

  if (num >= 1 || num === 0) {
      return formatNumber(num)
  }

  const fixed = num.toFixed(20)
  const strAfterDot = fixed.split('.')[1]!
  const strZeros = strAfterDot.split(/[123456789]/g, 1)[0]
  if (strZeros!.length < 4) return num.toFixed(4)
  const strAfterZeros = strAfterDot.slice(strZeros!.length, strZeros!.length + 3)
  return `${fixed.split('.')[0]!}.0${getSubNumberString(strZeros!.length - 1)}${strAfterZeros}`
}

export const formatEthDefinedNumber = (a: number | undefined) => (typeof a === 'number' || typeof a === 'string' ? formatNumber(formatEth(a)) : '-')
