<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ close: [] }>()

const dialogEl = useTemplateRef<HTMLDialogElement>('dialog')

watch(
  open,
  (isOpen) => {
    const el = dialogEl.value
    if (!el) return
    if (isOpen && !el.open) el.showModal()
    else if (!isOpen && el.open) el.close()
  },
  { flush: 'post' },
)

onMounted(() => {
  if (open.value) dialogEl.value?.showModal()
})

function close(): void {
  dialogEl.value?.close()
}

// Déclenché par close(), la touche Échap ou un clic sur le fond
function onClose(): void {
  open.value = false
  emit('close')
}

// Un clic dont la cible est la <dialog> elle-même vient du fond sombre
function onClick(e: MouseEvent): void {
  if (e.target === dialogEl.value) close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto h-4/5 w-4/5 max-w-[800px] min-w-[min(350px,95vw)] scale-95 overflow-y-auto overscroll-contain rounded-[5px] border-none p-0 opacity-0 transition-[opacity,scale,display,overlay] transition-discrete duration-300 backdrop:bg-black/80 open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0"
    @close="onClose"
    @click="onClick"
  >
    <div class="relative min-h-full">
      <button
        type="button"
        aria-label="Fermer"
        class="absolute top-0 right-0 z-10 m-1 cursor-pointer p-2 text-fg transition-transform duration-300 hover:-rotate-180 focus-visible:outline-2 focus-visible:outline-fg"
        @click="close"
      >
        <Icon name="lucide:x" class="size-6" />
      </button>
      <slot />
    </div>
  </dialog>
</template>
