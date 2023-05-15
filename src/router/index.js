import { createRouter, createWebHistory } from 'vue-router';

import GlobalView from '@/views/GlobalView.vue';
import HomeView from '@/views/HomeView.vue';
import WelcomeView from '@/views/WelcomeView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'global',
			component: GlobalView,
			meta: { requiresAuth: true },
			children: [{ path: '/', name: 'home', component: HomeView }]
		},
		{
			path: '/welcome',
			name: 'welcome',
			component: WelcomeView
		},
		{ path: '/:pathMatch(.*)*', redirect: { name: 'home', params: {} } }
	]
});

// eslint-disable-next-line no-unused-vars
router.beforeEach(async (to, from) => {
	if (to.meta.requiresAuth) {
		// TODO
	}

	return true;
});

export default router;
