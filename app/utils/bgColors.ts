import { Color } from 'three'
import type { Rgb } from '#shared/types/artist'

export type BgColors = { color1: Color; color2: Color }
export const defaultBgColors: BgColors = {
  color1: new Color(247, 175, 193),
  color2: new Color(246, 137, 139),
}
export const toBgColors = (c: { color1: Rgb; color2: Rgb }): BgColors => ({
  color1: new Color(...c.color1), // même constructeur qu'avant : valeurs brutes conservées
  color2: new Color(...c.color2),
})
