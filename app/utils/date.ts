const fmt = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC', // même résultat sur le serveur et dans le navigateur
})

export const formatEventDate = (iso: string) => fmt.format(new Date(`${iso}T00:00:00Z`))
export const isUpcoming = (iso: string) => iso >= new Date().toISOString().slice(0, 10)
