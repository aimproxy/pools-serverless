import { ethers } from 'ethers'

const READABLE_FORM_LEN = 4

export function toReadableAmount(rawAmount: number, decimals: number): string {
  return ethers
    .formatUnits(rawAmount, decimals)
    .slice(0, READABLE_FORM_LEN)
}