import { defineStore } from 'pinia';
import customAxios from '@/plugins/custom-axios';

export default defineStore('common', {
	state: () => ({ accountToken: null, axiosInstance: null }),
	getters: {
		axios: (state) => state.axios
	},
	actions: {
		initCustomAxios(token) {
			this.accountToken = customAxios(token);
		}
	}
});
