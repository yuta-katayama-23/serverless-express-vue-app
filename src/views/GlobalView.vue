<script setup>
import { RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import useCommonStore from '@/stores/common';

const commonStore = useCommonStore();
const { axios } = storeToRefs(commonStore);

console.log(axios.value);
</script>

<template>
	<v-app>
		<v-app-bar density="compact">
			<v-app-bar-title class="photos">{{ $t('app.title') }}</v-app-bar-title>

			<v-btn @click.stop="drawer = true" variant="text" icon>
				<v-icon> mdi-dots-vertical </v-icon>
			</v-btn>
		</v-app-bar>

		<v-main class="bg-grey-lighten-5">
			<!-- https://tech.yappli.io/entry/suspense-with-routerview -->
			<RouterView v-slot="{ Component }">
				<template v-if="Component">
					<Suspense
						timeout="0"
						@resolve="closeLoading"
						@pending="displayLoading"
					>
						<template #default>
							<component :is="Component" />
						</template>

						<template #fallback>
							<v-overlay
								:model-value="overlay"
								class="align-center justify-center"
							>
								<v-progress-circular color="primary" indeterminate size="64" />
							</v-overlay>
						</template>
					</Suspense>
				</template>
			</RouterView>
		</v-main>
	</v-app>
</template>

<style lang="sass" scoped>
.photos
	color: red
</style>
