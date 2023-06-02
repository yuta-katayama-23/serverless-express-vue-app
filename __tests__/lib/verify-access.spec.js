import { describe, test, expect, vi } from 'vitest';
import verifyAccess from '../../srv/lib/verify-access';

const reqHander = verifyAccess();

describe('invalid session(throw error)', () => {
	test('authorization header missing', async () => {
		const req = {
			headers: {}
		};
		const res = {
			status: (code) => {
				expect(code).toBe(500);
				return res;
			},
			error: (e) => {
				expect(e.status).toBe(401);
				expect(e.message).toBe('authorization header missing');
			}
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});

	test('invalid token type', async () => {
		const req = {
			headers: {
				authorization: 'invalid token'
			}
		};
		const res = {
			status: (code) => {
				expect(code).toBe(500);
				return res;
			},
			error: (e) => {
				expect(e.status).toBe(400);
				expect(e.message).toBe('invalid token type: invalid');
			}
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});

	test('token missing', async () => {
		const req = {
			headers: { authorization: 'Bearer' }
		};
		const res = {
			status: (code) => {
				expect(code).toBe(500);
				return res;
			},
			error: (e) => {
				expect(e.status).toBe(401);
				expect(e.message).toBe('token missing');
			}
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});

	test('invalid session by session is null', async () => {
		const req = {
			headers: { authorization: 'Bearer 123' },
			sessionStore: {
				get: (sid, cb) => {
					expect(sid).toBe('123');
					cb(null, null);
				}
			}
		};
		const res = {
			status: (code) => {
				expect(code).toBe(500);
				return res;
			},
			error: (e) => {
				expect(e.status).toBe(401);
				expect(e.message).toBe('invalid session');
			}
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});

	test('invalid session by session.userId is null and originalUrl is not /api/v1/signup', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: (sid, cb) => {
					expect(sid).toBe('123');
					cb(null, { userId: null });
				}
			},
			originalUrl: '/api/v1/user'
		};
		const res = {
			status: (code) => {
				expect(code).toBe(500);
				return res;
			},
			error: (e) => {
				expect(e.status).toBe(401);
				expect(e.message).toBe('invalid session');
			}
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});
});

describe('valid session', () => {
	test('valid session with session.userId exists', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: (sid, cb) => {
					expect(sid).toBe('123');
					cb(null, { userId: 1, email: 'sample@example.com' });
				}
			}
		};
		const res = {};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(req.token).toEqual({ userId: 1, email: 'sample@example.com' });
	});

	test('valid session with session.userId is null and originalUrl is /api/v1/signup', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: (sid, cb) => {
					expect(sid).toBe('123');
					cb(null, { userId: null, email: 'sample@example.com' });
				}
			},
			originalUrl: '/api/v1/signup'
		};
		const res = {};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(req.token).toEqual({ userId: null, email: 'sample@example.com' });
	});
});

describe('unexpected error', () => {
	test('unexpected error', async () => {
		const req = {
			headers: {
				authorization: 'Bearer 123'
			},
			sessionStore: {
				get: (sid, cb) => {
					expect(sid).toBe('123');
					cb(new Error('unexpected error'));
				}
			}
		};
		const res = {
			status: (code) => {
				expect(code).toBe(500);
				return res;
			},
			error: (e) => {
				expect(e.message).toBe('unexpected error');
			}
		};
		const next = vi.fn();
		await reqHander(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});
});
