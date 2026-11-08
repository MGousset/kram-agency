import { Color } from 'three'
import antmoUrl from '~/assets/img/antmo2.jpg'
import miraUrl from '~/assets/img/mira.jpeg'
import ronnieUrl from '~/assets/img/ronnie.jpg'

export const BOOKING_EMAIL = 'booking@kram-agency.com'

export interface Artist {
  name: string
  description: string[]
  imgUrls: string[]
  styles: string[]
  trackIds: string[] // ids SoundCloud numériques
  prodIds: string[]
  imageCenter: number // position verticale de la photo, en %
  network?: { insta?: string; soundCloud?: string }
}

// Couleurs en 0-255 : le shader divise par 255
export type BgColors = { color1: Color; color2: Color }

export const defaultBgColors: BgColors = {
  color1: new Color(247, 175, 193),
  color2: new Color(246, 137, 139),
}

export const artistes: Artist[] = [
  {
    name: 'Antmo',
    description: [
      'DJ brestois à l’origine du collectif KRAM, son style est taillé pour le club avec une techno sans concession, axée sur l’efficacité.',
      'Il construit ses sets en mêlant la répétition mentale de la techno hypnotique à un groove constant porté par ses tracks hardgroove.',
      'Son objectif est clair : maintenir la tension et vous faire bouger du début à la fin.',
    ],
    imgUrls: [antmoUrl],
    styles: ['Hardgroove', 'Techno'],
    network: {
      insta: 'https://www.instagram.com/antmo_dule_/',
      soundCloud: 'https://soundcloud.com/krambzh/sets/antmo',
    },
    trackIds: ['2225162126', '2190957747', '2190957507', '2056585340'],
    prodIds: ['2122589400'],
    imageCenter: 50,
  },
  {
    name: 'MIRA',
    description: [
      'Acid, envoûtant et percussif 👾',
      "Co-fondateur du projet Kram à Brest, Mira existe pour faire bouger les vibrer et les âmes. Partageant des moments d'euphorie et de lâcher prise unique avec le public.",
      'Armé de ses dernières découvertes musicales, Mira vous emmène avec lui pour un voyage immersif entre rythmiques saccadées et ligne de basse entraînante.',
      "Montez à bord, n'attachez pas vos ceintures et laissez-vous transporter par son énergie débordante.",
    ],
    imgUrls: [miraUrl],
    styles: ['Breakbeat', 'Bass', 'Techno'],
    network: {
      insta: 'https://www.instagram.com/mira3o3/',
      soundCloud: 'https://soundcloud.com/mira303',
    },
    trackIds: ['2221518107', '2206343819', '2193743643', '2187448993', '2134135164'],
    prodIds: [],
    imageCenter: 30,
  },
  {
    name: 'Ronnie',
    description: [
      "Fondateur du collectif KRAM et de nature plutôt curieux, Ronnie aime toucher à tout et explorer les styles musicaux qui l'entoure.",
      "Il écoute des artistes de différents horizons et ses selecta s'en ressentent avec des sets toujours plus originaux les uns que les autres.",
      "C’est dans le style house aux mélodies de piano entraînantes qu’il s'épanouit le plus et où il essaiera de vous y plonger en vous partageant ses dernières découvertes.",
      'Un seul objectif, transmettre cette énergie qui l’anime pour vous faire danser et oublier le temps d’un instant ce qui vous fatigue.',
    ],
    imgUrls: [ronnieUrl],
    styles: ['House', 'Hard House', 'Trance'],
    network: {
      insta: 'https://www.instagram.com/ronni_lusion/',
      soundCloud: 'https://soundcloud.com/raoul-rivier',
    },
    trackIds: ['2259576593', '2197414259', '2197390623', '2177484102', '2191290279'],
    prodIds: [],
    imageCenter: 30,
  },
]

export const colorByImageUrl = new Map<string, BgColors>([
  [antmoUrl, { color1: new Color(206, 271, 264), color2: new Color(50, 192, 195) }],
  [miraUrl, { color1: new Color(161, 168, 92), color2: new Color(94, 121, 50) }],
  [ronnieUrl, { color1: new Color(230, 174, 196), color2: new Color(216, 161, 190) }],
])
