import { describe, expect, test, vi } from 'vitest';
import CustomHttpError from '../../srv/lib/custom-http-error';
import verifyAccess from '../../srv/lib/verify-access';

const reqHander = verifyAccess();

describe('spy function with invalid session(throw error)', () => {
	test('authorization header missing', async () => {
		const req = { headers: {} };
		const res = {
			status: vi.fn().mockReturnThis(),
			error: vi.fn()
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.error).toHaveBeenCalledWith(
			new CustomHttpError(401, `authorization header missing`)
		);
		expect(next).not.toHaveBeenCalled();
	});

	test('invalid token type', async () => {
		const req = {
			headers: { authorization: 'invalid token' }
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			error: vi.fn()
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.error).toHaveBeenCalledWith(
			new CustomHttpError(400, `invalid token type: invalid`)
		);
		expect(next).not.toHaveBeenCalled();
	});

	test('token missing', async () => {
		const req = {
			headers: {
				authorization: 'Bearer'
			}
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			error: vi.fn()
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.error).toHaveBeenCalledWith(
			new CustomHttpError(401, `token missing`)
		);
		expect(next).not.toHaveBeenCalled();
	});

	test('invalid session by session is null', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: vi.fn().mockImplementation((sid, cb) => {
					cb(null, null);
				})
			}
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			error: vi.fn()
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.error).toHaveBeenCalledWith(
			new CustomHttpError(401, `invalid session`)
		);
		expect(next).not.toHaveBeenCalled();
	});

	test('invalid session by userId is null and originalUrl is not /api/v1/signup', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: vi.fn().mockImplementation((sid, cb) => {
					cb(null, { userId: null });
				})
			},
			originalUrl: '/api/v1/user'
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			error: vi.fn()
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.error).toHaveBeenCalledWith(
			new CustomHttpError(401, `invalid session`)
		);
		expect(next).not.toHaveBeenCalled();
	});
});

describe('spy function with valid session', () => {
	test('valid session with session.userId exists', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: vi.fn().mockImplementation((sid, cb) => {
					cb(null, { userId: 1, email: 'sample@example.com' });
				})
			}
		};
		const res = {};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(req.token).toEqual({
			sid: '123',
			userId: 1,
			email: 'sample@example.com'
		});
	});

	test('valid session with session.userId is null and originalUrl is /api/v1/signup', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: vi.fn().mockImplementation((sid, cb) => {
					cb(null, { userId: null, email: 'sample@example.com' });
				})
			},
			originalUrl: '/api/v1/signup'
		};
		const res = {};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(req.token).toEqual({
			sid: '123',
			userId: null,
			email: 'sample@example.com'
		});
	});
});

describe('spy function with unexpected error', () => {
	test('unexpected error', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: vi.fn().mockImplementation((sid, cb) => {
					cb(new Error('unexpected error'));
				})
			}
		};
		const res = {
			status: vi.fn().mockReturnThis(),
			error: vi.fn()
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.error).toHaveBeenCalledWith(new Error('unexpected error'));
		expect(next).not.toHaveBeenCalled();
	});
});
