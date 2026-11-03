// @ts-check
// ESLint ne garde que ce qu'Oxlint ne sait pas faire (templates Vue, règles Nuxt).
// eslint-plugin-oxlint désactive les règles en doublon : il doit rester en dernier.
import oxlint from 'eslint-plugin-oxlint'
import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt(...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'))
