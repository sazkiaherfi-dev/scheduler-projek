const { createSessionToken, requireAuth, SESSION_COOKIE } = require('../middleware/auth');

function createResponse() {
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

describe('Sesi autentikasi', () => {
    test('menandai sesi demo pada request terautentikasi', () => {
        const req = {
            headers: {
                cookie: `${SESSION_COOKIE}=${createSessionToken(42, Date.now(), true)}`
            }
        };
        const res = createResponse();
        const next = jest.fn();

        requireAuth(req, res, next);

        expect(req.userId).toBe(42);
        expect(req.isDemo).toBe(true);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBeNull();
    });

    test('mempertahankan sesi akun biasa tanpa penanda demo', () => {
        const req = {
            headers: {
                cookie: `${SESSION_COOKIE}=${createSessionToken(42)}`
            }
        };
        const res = createResponse();
        const next = jest.fn();

        requireAuth(req, res, next);

        expect(req.userId).toBe(42);
        expect(req.isDemo).toBe(false);
        expect(next).toHaveBeenCalledTimes(1);
    });
});
