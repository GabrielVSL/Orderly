const sessionMiddleware = (req, res, next) => {
  const headerSessionId = req.headers['x-session-id'];

  if (typeof headerSessionId === 'string' && headerSessionId.trim().length > 0) {
    req.sessionId = headerSessionId.trim();
  } else {
    req.sessionId = 'guest-session';
  }

  res.setHeader('x-session-id', req.sessionId);
  next();
};

module.exports = sessionMiddleware;
