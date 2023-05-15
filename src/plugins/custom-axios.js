import { strict as assert } from 'node:assert';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export default (token) => {
	assert.ok(token, 'token must be required');

	const client = axios.create({
		baseURL: '/api/v1',
		headers: { common: { Authorization: `Bearer ${token}` } }
	});

	axiosRetry(client, {
		retryDelay: axiosRetry.exponentialDelay
	});

	client.interceptors.request.use((request) => {
		const { data, params } = request;
		if (params)
			return {
				...request,
				params: snakecaseKeys(params)
			};
		if (!data) return request;

		return {
			...request,
			data:
				typeof data === 'string' ? data : snakecaseKeys(data, { deep: true })
		};
	});

	client.interceptors.response.use((response) => {
		const { data } = response;
		if (!data) return response;

		return {
			...response,
			data: camelcaseKeys(data, { deep: true })
		};
	});

	return client;
};
