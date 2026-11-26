const crypto = require('crypto');

const SESSION_COOKIE = 'scheduler_session';
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;
const sessionSecret = process.env.AUTH_TOKEN_SECRET || 'scheduler-projek-demo-secret-key-2026';

function sign(value) {
    return crypto.createHmac('sha256', sessionSecret).update(value).digest('base64url');
}

function createSessionToken(userId, now = Date.now(), isDemo = false) {
    const session = {
        userId,
        expiresAt: Math.floor(now / 1000) + SESSION_DURATION_SECONDS
    };
    if (isDemo) session.isDemo = true;
    const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
    return `${payload}.${sign(payload)}`;
}

function getSession(req, now = Date.now()) {
    const cookies = req.headers.cookie || '';
    const token = cookies
        .split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(`${SESSION_COOKIE}=`))
        ?.slice(SESSION_COOKIE.length + 1);

    if (!token) return null;

    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;

    const expectedSignature = Buffer.from(sign(payload));
    const providedSignature = Buffer.from(signature);
    if (
        expectedSignature.length !== providedSignature.length ||
        !crypto.timingSafeEqual(expectedSignature, providedSignature)
    ) {
        return null;
    }

    try {
        const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (
            !Number.isInteger(session.userId) ||
            session.userId < 1 ||
            !Number.isInteger(session.expiresAt) ||
            session.expiresAt <= Math.floor(now / 1000)
        ) {
            return null;
        }
        return { userId: session.userId, isDemo: session.isDemo === true };
    } catch (error) {
        return null;
    }
}

function getSessionUserId(req, now = Date.now()) {
    return getSession(req, now)?.userId || null;
}

function setSessionCookie(res, userId, { isDemo = false } = {}) {
    res.cookie(SESSION_COOKIE, createSessionToken(userId, Date.now(), isDemo), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: SESSION_DURATION_SECONDS * 1000,
        path: '/'
    });
}

function clearSessionCookie(res) {
    res.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });
}

function requireAuth(req, res, next) {
    const session = getSession(req);
    if (!session) {
        return res.status(401).json({ error: 'Silakan masuk terlebih dahulu' });
    }
    req.userId = session.userId;
    req.isDemo = session.isDemo;
    next();
}

module.exports = {
    SESSION_COOKIE,
    clearSessionCookie,
    createSessionToken,
    getSessionUserId,
    requireAuth,
    setSessionCookie
};