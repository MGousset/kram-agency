import type { Rgb } from '#shared/types/artist'

export type BgRgb = { color1: Rgb; color2: Rgb }
export const DEFAULT_BG: BgRgb = { color1: [247, 175, 193], color2: [246, 137, 139] }

export const useBgColors = () => useState<BgRgb>('bg-colors', () => DEFAULT_BG)
