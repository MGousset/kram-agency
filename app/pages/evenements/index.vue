<script setup lang="ts">
import type { StyleValue } from 'vue'
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

// --- Photos réparties de part et d'autre de la frise ---------------------
// depth = position de la photo sur l'axe de la frise (en "nombre d'événements").
// Le CSS calcule --d = depth - --progress :
//   --d > 0  → la photo est devant nous, au loin
//   --d = 0  → l'événement est au centre
//   --d < 0  → la photo nous a dépassés (elle s'efface)
const MAX_PHOTOS = 3
const Y_OFFSETS = [-16, 14, -2] // décalage vertical (dvh) par photo d'un même événement

const shots = computed(() =>
  events.value.flatMap((e, i) =>
    (e.photos ?? []).slice(0, MAX_PHOTOS).map((src, j) => {
      const side = (i + j) % 2 === 0 ? 1 : -1 // alterne droite / gauche
      return {
        key: `${e.slug}-${j}`,
        src,
        alt: e.name,
        style: {
          '--d': `calc(${(i + j * 0.35).toFixed(2)} - var(--progress))`,
          '--x': `calc(${side} * var(--spread))`,
          '--y': `${Y_OFFSETS[j] ?? 0}dvh`,
        } as StyleValue,
      }
    }),
  ),
)

// --- Progression continue + événement actif ------------------------------
const scroller = useTemplateRef<HTMLElement>('scroller')
const stage = useTemplateRef<HTMLElement>('stage')

function itemEl(marker: HTMLElement) {
  return marker.closest<HTMLElement>('[data-slot="item"]') ?? marker
}

let target = 0 // progression visée (calculée depuis le scroll)
let current = 0 // progression affichée (lissée)

// Progression = index décimal de l'événement au centre de la zone qui défile
// (ex. 2.4 = entre le 3e et le 4e événement, plus proche du 3e).
function measure() {
  const root = scroller.value
  if (!root) return
  const box = root.getBoundingClientRect()
  const mid = box.top + box.height / 2
  const markers = [...root.querySelectorAll<HTMLElement>('[data-slug]')]
  const centers = markers.map((m) => {
    const r = itemEl(m).getBoundingClientRect()
    return r.top + r.height / 2
  })
  if (!centers.length) return

  const last = centers.length - 1
  let p = 0
  if (mid >= centers[last]!) p = last
  else if (mid > centers[0]!) {
    const k = centers.findIndex((_, i) => mid < centers[i + 1]!)
    p = k + (mid - centers[k]!) / (centers[k + 1]! - centers[k]!)
  }
  target = p

  const slug = markers[Math.round(p)]?.dataset.slug
  if (slug && slug !== activeSlug.value) activeSlug.value = slug
}

// Lissage : --progress rejoint la cible en douceur, puis la boucle se met en pause.
// On écrit directement la variable CSS : aucun re-rendu Vue à chaque frame.
const { pause, resume } = useRafFn(
  () => {
    current += (target - current) * 0.12
    if (Math.abs(target - current) < 0.001) {
      current = target
      pause()
    }
    stage.value?.style.setProperty('--progress', current.toFixed(4))
  },
  { immediate: false },
)

function onScroll() {
  measure()
  resume()
}
useEventListener(scroller, 'scroll', onScroll, { passive: true })
useResizeObserver(scroller, onScroll)

// Au chargement : centrer le prochain événement à venir, sans animation
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
  measure()
  current = target
  stage.value?.style.setProperty('--progress', current.toFixed(4))
})
</script>

<template>
  <main class="relative z-1 flex h-dvh w-full items-center justify-center overflow-hidden bg-bg">
    <!-- Scène 3D : les photos avancent vers le spectateur -->
    <div
      ref="stage"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden [--gap:600px] [--progress:0] [--spread:clamp(9rem,30vw,28rem)] perspective-[1000px] transform-3d motion-reduce:hidden"
    >
      <img
        v-for="shot in shots"
        :key="shot.key"
        :src="shot.src"
        :alt="shot.alt"
        :style="shot.style"
        loading="lazy"
        decoding="async"
        class="absolute top-1/2 left-1/2 aspect-4/5 w-[clamp(8rem,22vw,18rem)] transform-[translate(-50%,-50%)_translate3d(var(--x),var(--y),calc(var(--d)*var(--gap)*-1))] rounded-xl object-cover opacity-[clamp(0,min((3-var(--d))/1.5,(var(--d)+0.6)/0.6),1)] shadow-2xl will-change-transform backface-hidden"
      />
    </div>

    <!-- Si l'utilisateur préfère moins d'animations : simple fond en fondu -->
    <div aria-hidden="true" class="absolute inset-0 hidden motion-reduce:block">
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
          alt=""
          class="absolute inset-0 size-full object-cover opacity-25"
        />
      </Transition>
    </div>

    <!-- Frise centrée, au-dessus des photos -->
    <div
      ref="scroller"
      class="relative z-10 h-[70dvh] w-full max-w-md scrollbar-none overflow-y-auto overscroll-contain mask-[linear-gradient(transparent,black_20%,black_80%,transparent)] px-6"
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
            {{ item.event.guests.join(', ') }}
          </p>
        </template>
      </UTimeline>
    </div>
  </main>
</template>
