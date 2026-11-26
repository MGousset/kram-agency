/** Copie un texte dans le presse-papiers et affiche une confirmation */
export function useCopy() {
  const { copy: writeToClipboard } = useClipboard({ legacy: true })
  const { add } = useToast()

  async function copy(text: string): Promise<void> {
    try {
      await writeToClipboard(text)
      add({ title: `Copié : ${text}` })
    } catch {
      add({ title: `Copie impossible : ${text}` })
    }
  }

  return { copy }
}
