<!-- app/pages/evenements/index.vue -->
<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'
import { formatEventDate, isUpcoming } from '~/utils/date'

const { data: events } = await useFetch('/api/events', { default: () => [] })
type KramEvent = (typeof events.value)[number]
type EventItem = TimelineItem & { event: KramEvent }

const activeSlug = ref<string | undefined>(events.value[0]?.slug)
const active = computed(() => events.value.find((e) => e.slug === activeSlug.value))

const items = computed<EventItem[]>(() =>
  events.value.map((e) => ({
    value: e.slug,
    date: e.date,
    title: e.name,
    description: e.location,
    icon: isUpcoming(e.date) ? 'i-lucide-calendar-clock' : 'i-lucide-calendar-check',
    class: [
      'transition-opacity duration-300',
      e.slug === activeSlug.value ? 'opacity-100' : 'opacity-40',
    ],
    event: e,
  })),
)

// --- Événement actif = le plus proche du centre de la zone qui défile ---
const scroller = useTemplateRef<HTMLElement>('scroller')

function itemEl(marker: HTMLElement) {
  return marker.closest<HTMLElement>('[data-slot="item"]') ?? marker
}

function updateActive() {
  const root = scroller.value
  if (!root) return
  const box = root.getBoundingClientRect()
  const center = box.top + box.height / 2
  let best: string | undefined
  let bestDist = Infinity
  for (const marker of root.querySelectorAll<HTMLElement>('[data-slug]')) {
    const r = itemEl(marker).getBoundingClientRect()
    const dist = Math.abs(r.top + r.height / 2 - center)
    if (dist < bestDist) {
      bestDist = dist
      best = marker.dataset.slug
    }
  }
  if (best && best !== activeSlug.value) activeSlug.value = best
}

let raf = 0
function onScroll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(updateActive)
}
useEventListener(scroller, 'scroll', onScroll, { passive: true })
useResizeObserver(scroller, onScroll)

// Au chargement : centrer le prochain événement à venir
onMounted(() => {
  const root = scroller.value
  const next = events.value
    .filter((e) => isUpcoming(e.date))
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  const marker = next ? root?.querySelector<HTMLElement>(`[data-slug="${next.slug}"]`) : null
  if (root && marker) {
    const r = itemEl(marker).getBoundingClientRect()
    const box = root.getBoundingClientRect()
    root.scrollTop += r.top + r.height / 2 - (box.top + box.height / 2)
  }
  updateActive()
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <section class="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2 lg:px-12">
    <!-- Photo de l'événement actif (fondu enchaîné) -->
    <div class="relative h-56 overflow-hidden rounded-xl lg:h-[70dvh]">
      <Transition
        enter-active-class="transition-opacity duration-500"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-500"
        leave-to-class="opacity-0"
      >
        <img
          v-if="active?.photos?.[0]"
          :key="active.slug"
          :src="active.photos[0]"
          :alt="active.name"
          class="absolute inset-0 size-full object-cover"
        />
      </Transition>
    </div>

    <!-- Frise -->
    <div
      ref="scroller"
      class="h-[60dvh] [scrollbar-width:none] overflow-y-auto overscroll-contain lg:h-[70dvh]"
    >
      <UTimeline
        :items="items"
        :model-value="activeSlug"
        color="neutral"
        size="sm"
        class="py-[30dvh]"
        :ui="{
          wrapper: 'pb-10',
          date: 'text-xs uppercase tracking-wide text-fg/60',
          title: 'text-lg font-semibold text-fg',
          description: 'text-sm text-fg/70',
        }"
      >
        <template #date="{ item }">
          {{ formatEventDate(item.event.date) }}
          <UBadge
            v-if="isUpcoming(item.event.date)"
            label="À venir"
            color="neutral"
            size="sm"
            class="ms-2"
          />
        </template>

        <template #title="{ item }">
          <NuxtLink
            :to="`/evenements/${item.event.slug}`"
            :data-slug="item.event.slug"
            class="underline-offset-4 hover:underline"
          >
            {{ item.event.name }}
          </NuxtLink>
        </template>

        <template #description="{ item }">
          <p v-if="item.event.location" class="flex items-center gap-1">
            <UIcon name="i-lucide-map-pin" class="size-4 shrink-0" />
            {{ item.event.location }}
          </p>

          <div v-if="item.event.styles?.length" class="mt-2 flex flex-wrap gap-1">
            <UBadge
              v-for="style in item.event.styles"
              :key="style"
              :label="style"
              color="neutral"
              variant="outline"
              size="sm"
            />
          </div>

          <p v-if="item.event.guests?.length" class="mt-2">
            <span v-if="item.event.guests?.length">
              {{ item.event.guests.join(', ') }}
            </span>
          </p>
        </template>
      </UTimeline>
    </div>
  </section>
</template>
