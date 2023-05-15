<script setup>
import HelloWorld from '@/components/HelloWorld.vue';
</script>

<template>
	<v-main class="bg-grey-lighten-5">
		<v-container>
			<h1>This is an welcome page</h1>
			<img
				alt="Vue logo"
				class="logo"
				src="@/assets/logo.svg"
				width="125"
				height="125"
			/>

			<HelloWorld msg="You did it!" />
		</v-container>
	</v-main>
</template>
