const crypto = require('crypto');

const sessionMiddleware = (req, res, next) => {
  const headerSessionId = req.headers['x-session-id'];

  if (typeof headerSessionId === 'string' && headerSessionId.trim().length > 0) {
    req.sessionId = headerSessionId.trim();
  } else if (process.env.NODE_ENV === 'test') {
    req.sessionId = 'guest-session';
  } else {
    req.sessionId = 'sess_' + (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));
  }

  res.setHeader('x-session-id', req.sessionId);
  next();
};

module.exports = sessionMiddleware;
