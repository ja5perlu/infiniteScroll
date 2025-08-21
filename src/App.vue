

<script setup>
import { ref } from 'vue'
import InfiniteScroll from './components/InfiniteScroll.vue'
import RepoItem from './components/RepoItem.vue'
import { fetchUserRepos } from './api/github.js'

const username = 'vuejs' // 若要改用自己帳號可修改此處
const repos = ref([])
const page = ref(1)
const loading = ref(false)
const finished = ref(false)
const PER_PAGE = 10

async function loadMore() {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const newRepos = await fetchUserRepos(username, page.value, PER_PAGE)
    if (newRepos.length < PER_PAGE) finished.value = true
    repos.value.push(...newRepos)
    page.value++
  } catch (e) {
    finished.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->
    <div class="wrapper">
      <!-- <h1>Infinite Scroll Example</h1> -->
    </div>
  </header>
  <main style="height: 60vh;">
    <InfiniteScroll :loading="loading" :disabled="finished" @loadMore="loadMore">
      <div v-for="repo in repos" :key="repo.id">
        <RepoItem :repo="repo" />
      </div>
      <div v-if="finished && repos.length > 0" style="text-align:center;color:#888;padding:1em;">-- 已載入全部 --</div>
      <div v-if="!finished && repos.length === 0 && !loading" style="text-align:center;color:#888;padding:1em;">暫無資料</div>
      <div style="text-align:center;color:#888;padding:1em;">（資料來源：vuejs 的 GitHub repos）</div>
    </InfiniteScroll>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
