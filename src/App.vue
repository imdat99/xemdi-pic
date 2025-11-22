<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import Test from './components/Test';
import useSWRV from './lib/swr';

// Lấy dữ liệu
const { data } = useSWRV('https://jsonplaceholder.typicode.com/todos/1');
const { data: data2 } = useSWRV('https://jsonplaceholder.typicode.com/todos/2');
</script>

<template>
	<div>
		<a href="https://vite.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
		<pre>{{ data }}</pre>
		<pre>{{ data2 }}</pre>
		<a href="https://vuejs.org/" target="_blank">
			<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
		</a>
	</div>
	<HelloWorld msg="Vite + Vue" id="4" />
	<HelloWorld msg="Vite + Vue" id="5" />
	<HelloWorld msg="Vite + Vue" id="6" />
	<Test jobId="10" />
</template>
