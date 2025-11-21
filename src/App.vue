<script setup lang="ts">
import { useRoute } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue'
import useSWRV from './lib/swr';

// Lấy dữ liệu
            const {data} = useSWRV('https://jsonplaceholder.typicode.com/todos/1');
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <pre>{{ data }}</pre>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>
