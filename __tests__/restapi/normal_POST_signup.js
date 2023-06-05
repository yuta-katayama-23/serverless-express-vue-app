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
		test('should return 201', async () => {
			const res = await axios.post(`${host}/api/v1/signup`, data);
			expect(res.status).toBe(201);
			expect(res.data).not.toHaveProperty('id');
			expect(res.data).toHaveProperty('account_type', 'personal');
			expect(res.data).toHaveProperty('last_name', '太郎');
			expect(res.data).toHaveProperty('first_name', '山田');
			expect(res.data).toHaveProperty('full_name', '山田 太郎');
			expect(res.data).toHaveProperty('gender', 'male');
			expect(res.data).toHaveProperty('email', expect.any(String));
			expect(res.data).toHaveProperty('last_logined_at', expect.any(Number));
			expect(res.data).toHaveProperty('created_at', expect.any(Number));
			expect(res.data).toHaveProperty('updated_at', expect.any(Number));
		});

		test('should return 409', async () => {
			await expect(() =>
				axios.post(`${host}/api/v1/signup`, data)
			).rejects.toThrowError('Request failed with status code 409');
		});

		test('should return 409 by try-catch', async () => {
			let res;

			try {
				res = await axios.post(`${host}/api/v1/signup`, data);
			} catch (error) {
				res = error.response;
			}

			expect(res.status).toBe(409);
			// FIXME vitestのHTTP responses assertに変える
			// https://github.com/openapi-library/OpenAPIValidators/tree/master/packages/jest-openapi#readme
			expect(res.data).toHaveProperty('message', 'user already exists');
			expect(res.data).toHaveProperty(
				'errors[0].message',
				'user already exists'
			);
			expect(res.data).toHaveProperty('status_code', 409);
			expect(res.data).toHaveProperty('code', expect.any(String));
			expect(res.data).toHaveProperty('path', 'POST:/api/v1/signup');
		});
	});

	describe('Terndown', () => {
		test('delete user: DELETE:/api/v1/user', async () => {
			const res = await axios.delete(`${host}/api/v1/user`);
			expect(res.status).toBe(204);
		});
	});
});
