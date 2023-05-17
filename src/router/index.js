import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import qs from 'qs';

import useCommonStore from '@/stores/common';
import GlobalView from '@/views/GlobalView.vue';

const mode = import.meta.env.MODE;
const tokenEndpoint =
	mode && mode !== 'development' ? `/${mode}/auth/token` : '/auth/token';
const loginEndpoint =
	mode && mode !== 'development' ? `/${mode}/auth/login` : '/auth/login';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: loginEndpoint,
			redirect: (to) => {
				const { url } = to.query;
				window.location.href = url
					? `${loginEndpoint}/?${qs.stringify({ url })}`
					: `${loginEndpoint}/`;
			}
		},
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
	const commonStore = useCommonStore();
	const { initCustomAxios } = commonStore;

	if (to.meta.requiresAuth) {
		try {
			const {
				data: { token: accountToken }
			} = await axios.get(tokenEndpoint);
			initCustomAxios(accountToken);
		} catch (e) {
			return {
				path: loginEndpoint,
				query: { url: to.path }
			};
		}
	}

	return true;
});

export default router;
