<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

interface SelectOption {
  label: string;
  value: string;
}

const props = defineProps<{
  modelValue: string;
  options: SelectOption[];
  placeholder: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  const matched = props.options.find((item) => item.value === props.modelValue);
  return matched?.label || props.placeholder;
});

function toggle() {
  open.value = !open.value;
}

function select(value: string) {
  emit('update:modelValue', value);
  open.value = false;
}

function onDocumentClick(event: MouseEvent) {
  if (!rootRef.value) return;
  const target = event.target as Node;
  if (!rootRef.value.contains(target)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>

<template>
  <div ref="rootRef" class="relative">
    <button type="button" class="page-select-btn" :aria-expanded="open" @click="toggle">
      <span>{{ selectedLabel }}</span>
      <svg class="h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': open }" viewBox="0 0 20 20" fill="none">
        <path d="M5.5 7.5L10 12.5L14.5 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <transition name="route-fade">
      <ul v-if="open" class="page-select-menu">
        <li
          v-for="option in options"
          :key="option.value"
          class="page-select-item"
          :class="{ active: option.value === modelValue }"
          @click="select(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>
