<script setup lang="ts">
// Popover : passe dans la couche supérieure du navigateur,
// donc reste visible même au-dessus d'une <dialog> ouverte
const { toast } = useToast()
const el = useTemplateRef<HTMLElement>('el')

watch(
  () => [toast.value.visible, toast.value.key] as const,
  ([visible]) => {
    const popover = el.value
    if (!popover) return
    if (popover.matches(':popover-open')) popover.hidePopover()
    if (visible) popover.showPopover() // ré-afficher = repasser au premier plan
  },
)
</script>

<template>
  <div
    ref="el"
    popover="manual"
    role="status"
    aria-live="polite"
    class="top-auto right-4 bottom-4 left-auto m-0 translate-y-2 rounded-[5px] border-0 bg-white px-4 py-3 text-fg-inverse opacity-0 shadow-lg transition-[opacity,translate,display,overlay] transition-discrete duration-200 open:translate-y-0 open:opacity-100 starting:open:translate-y-2 starting:open:opacity-0"
  >
    {{ toast.text }}
  </div>
</template>
