import snakecaseKeys from 'snakecase-keys';
import { describe, expect, test, beforeEach } from 'vitest';
import axios from 'axios';
import fs from 'fs';
import config from 'config';
import appRoot from 'app-root-path';

const accessTokens = {};
const setAuthorization = (user) => {
	axios.defaults.headers.common.Authorization = `Bearer ${accessTokens[user].token}`;
};

describe('Setup token', () => {
	test('import token.json', async () => {
		const tokenJson = JSON.parse(
			fs.readFileSync(appRoot.resolve('__tests__/token.json'), 'utf8')
		);
		expect(tokenJson).toHaveProperty('token', expect.any(String));

		accessTokens.testUser = { token: tokenJson.token };
	});
});

describe('normal POST todo', () => {
	const host = config.get('host');
	const data = snakecaseKeys({
		accountType: 'personal',
		lastName: '太郎',
		firstName: '山田',
		gender: 'male'
	});

	beforeEach(() => {
		setAuthorization('testUser');
	});

	describe.skip('Setup', () => {});

	describe('Test Block', () => {
		test('should return 400', async () => {
			await expect(() =>
				axios.post(`${host}/api/v1/signup`, {})
			).rejects.toThrowError('Request failed with status code 400');
		});

		test('should return 401', async () => {
			delete axios.defaults.headers.common.Authorization;
			await expect(() =>
				axios.post(`${host}/api/v1/signup`, data)
			).rejects.toThrowError('Request failed with status code 401');
		});
	});

	describe.skip('Terndown', () => {});
});
