<template>
  <div>
    <div v-if="total !== null" class="fixed-count">{{ repos.length }}/{{ total }}</div>
    <div ref="scrollContainer" class="infinite-scroll-container">
      <div v-for="repo in repos" :key="repo.id">
        <slot name="repo" :repo="repo">
          <!-- fallback: 顯示 repo.name -->
          <div>{{ repo.name }}</div>
        </slot>
      </div>
      <div v-if="finished && repos.length > 0" class="loading">-- 已載入全部 --</div>
      <div v-if="!finished && repos.length === 0 && !loading" class="loading">
        暫無資料
      </div>
      <div v-if="loading" class="loading">Loading...</div>
      <div class="loading" style="font-size: 0.9em">
        （資料來源：vuejs 的 GitHub repos）
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { fetchUserRepos, fetchUserTotalRepos } from "../api/github.js";
const total = ref(null);
const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});

const repos = ref([]);
const page = ref(1);
const loading = ref(false);
const finished = ref(false);
const PER_PAGE = 10;
const scrollContainer = ref(null);

async function loadMore() {
  if (loading.value || finished.value) return;
  loading.value = true;
  try {
    // 只在第一次載入時取得總數
    if (total.value === null) {
      try {
        total.value = await fetchUserTotalRepos(props.username);
      } catch (e) {
        total.value = 0;
      }
    }
    const newRepos = await fetchUserRepos(props.username, page.value, PER_PAGE);
    if (newRepos.length < PER_PAGE) finished.value = true;
    repos.value.push(...newRepos);
    page.value++;
    await nextTick();
    // 若內容還是不足以滾動且還沒 finished，則自動再載入一次
    const el = scrollContainer.value;
    if (el && el.scrollHeight <= el.clientHeight + 2 && !finished.value) {
      await loadMore();
    }
  } catch (e) {
    finished.value = true;
  } finally {
    loading.value = false;
  }
}

function onScroll() {
  if (finished.value || loading.value) return;
  // 偵測 body/視窗滾動
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
    loadMore();
  }
}

onMounted(() => {
  loadMore().then(() => {
    // 初次載入後，若內容高度仍小於視窗高度，則再載入一次
    if (
      document.body.scrollHeight <= window.innerHeight + 2 &&
      !finished.value
    ) {
      loadMore();
    }
  });
  window.addEventListener("scroll", onScroll, { passive: true });
});

// 清理事件
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 1em;
  color: #888;
}
.fixed-count {
  position: fixed;
  top: 12px;
  left: 16px;
  background: #222;
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 1rem;
  z-index: 1000;
  opacity: 0.85;
}
</style>
