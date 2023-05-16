import { createRouter, createWebHistory } from 'vue-router';

import GlobalView from '@/views/GlobalView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'global',
			component: GlobalView,
			meta: { requiresAuth: true },
			children: [
				{ path: '/', redirect: { name: 'home', params: {} } },
				{
					path: '/home',
					name: 'home',
					component: () => import('@/views/HomeView.vue')
				}
			]
		},
		{
			path: '/welcome',
			name: 'welcome',
			component: () => import('@/views/WelcomeView.vue')
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
