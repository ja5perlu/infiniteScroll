<template>
  <div ref="scrollContainer" class="infinite-scroll-container" @scroll="onScroll">
    <slot></slot>
    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  loading: Boolean,
  disabled: Boolean
})
const emit = defineEmits(['loadMore'])
const scrollContainer = ref(null)

function onScroll() {
  if (props.disabled || props.loading) return
  const el = scrollContainer.value
  if (!el) return
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    emit('loadMore')
  }
}

onMounted(() => {
  // 若內容不足以滾動，則自動觸發一次
  if (scrollContainer.value && scrollContainer.value.scrollHeight <= scrollContainer.value.clientHeight) {
    emit('loadMore')
  }
})
</script>

<style scoped>
.infinite-scroll-container {
  overflow-y: auto;
  height: 100%;
  position: relative;
}
.loading {
  text-align: center;
  padding: 1em;
  color: #888;
}
</style>
