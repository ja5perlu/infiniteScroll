
<template>
  <div ref="scrollContainer" class="infinite-scroll-container" @scroll="onScroll">
    <div v-for="repo in repos" :key="repo.id">
      <slot name="repo" :repo="repo">
        <!-- fallback: 顯示 repo.name -->
        <div>{{ repo.name }}</div>
      </slot>
    </div>
    <div v-if="finished && repos.length > 0" class="loading">-- 已載入全部 --</div>
    <div v-if="!finished && repos.length === 0 && !loading" class="loading">暫無資料</div>
    <div v-if="loading" class="loading">Loading...</div>

    <div class="loading" style="font-size:0.9em;">（資料來源：vuejs 的 GitHub repos）</div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { fetchUserRepos } from '../api/github.js'

const props = defineProps({
  username: {
    type: String,
    required: true
  }
})

const repos = ref([])
const page = ref(1)
const loading = ref(false)
const finished = ref(false)
const PER_PAGE = 10
const scrollContainer = ref(null)
const canScroll = ref(true)

async function loadMore() {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const newRepos = await fetchUserRepos(props.username, page.value, PER_PAGE)
    if (newRepos.length < PER_PAGE) finished.value = true
    repos.value.push(...newRepos)
    page.value++
    await nextTick()
    checkScrollable()
    // 若內容還是不足以滾動且還沒 finished，則自動再載入一次
    const el = scrollContainer.value
    if (el && el.scrollHeight <= el.clientHeight + 2 && !finished.value) {
      await loadMore()
    }
  } catch (e) {
    finished.value = true
  } finally {
    loading.value = false
  }
}

function onScroll() {
  if (finished.value || loading.value) return
  const el = scrollContainer.value
  if (!el) return
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    loadMore()
  }
}

function checkScrollable() {
  const el = scrollContainer.value
  if (!el) return
  canScroll.value = el.scrollHeight > el.clientHeight + 2
}

onMounted(() => {
  loadMore()
  nextTick(checkScrollable)
})
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 1em;
  color: #888;
}
</style>
