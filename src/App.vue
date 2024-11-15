<script setup lang="ts">
import DrawIt from './components/DrawIt.vue'

</script>

<template>
  <DrawIt class="dwg"/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.dwg {
  display: flex;
  margin: 0 auto;
}
</style>

<style>
#app {
  width: 100%;
  box-sizing: border-box;
  height: 80%;
}
</style>