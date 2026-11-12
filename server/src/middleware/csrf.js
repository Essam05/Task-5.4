import { doubleCsrf } from 'csrf-csrf';

// The JWT in the httpOnly auth cookie is a per-login session identifier. The
// attacker can cause it to be sent, but cannot read it or use it to construct
// the matching signed double-submit token.
const csrf = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || process.env.JWT_SECRET,
  getSessionIdentifier: (req) => req.cookies?.token || 'anonymous',
  cookieName: 'csrfToken',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  },
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token']
});

export const { generateCsrfToken, doubleCsrfProtection } = csrf;
