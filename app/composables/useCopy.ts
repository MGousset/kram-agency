let hideTimer: ReturnType<typeof setTimeout> | undefined

/** Toast global, affiché par <AppToast /> dans app.vue */
export function useToast() {
  const state = useState('toast', () => ({ text: '', visible: false, key: 0 }))

  function show(text: string, duration = 3000): void {
    state.value = { text, visible: true, key: state.value.key + 1 }
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => (state.value.visible = false), duration)
  }

  return { toast: readonly(state), show }
}

/** Copie un texte dans le presse-papiers et affiche une confirmation */
export function useCopy() {
  const { copy: writeToClipboard } = useClipboard({ legacy: true })
  const { show } = useToast()

  async function copy(text: string): Promise<void> {
    try {
      await writeToClipboard(text)
      show(`Copié : ${text}`)
    } catch {
      show(`Copie impossible : ${text}`)
    }
  }

  return { copy }
}
