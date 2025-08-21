

<script setup>
import { ref } from 'vue'
import InfiniteScroll from './components/InfiniteScroll.vue'
import RepoItem from './components/RepoItem.vue'

const username = 'vuejs' // 若要改用自己帳號可修改此處
</script>

<template>
  <div class="scroll-wrapper">
    <InfiniteScroll :username="username">
      <template #repo="{ repo }">
        <RepoItem :repo="repo" />
      </template>
    </InfiniteScroll>
  </div>
</template>

<style scoped>
</style>
