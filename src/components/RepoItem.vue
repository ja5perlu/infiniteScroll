<template>
  <div class="repo-item">
    <h3>
      <a :href="repo.html_url" target="_blank" rel="noopener">{{ repo.name }}</a>
    </h3>
    <p class="description">{{ repo.description || 'No description' }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  repo: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.repo-item {
  border-bottom: 1px solid #eee;
  padding: 1em 0;
}
.repo-item h3 {
  margin: 0 0 0.5em 0;
  font-size: 1.1em;
}
.repo-item a {
  color: #42b983;
  text-decoration: none;
}
.repo-item a:hover {
  text-decoration: underline;
}
.description {
  color: #666;
  font-size: 0.95em;
}
</style>
