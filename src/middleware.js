import crypto from 'crypto';
import { executeQuery } from './helpers';

const middleware = ({ hostname, db }) => async (req, res, next) => {
  req.sessionId = false;
  req.userId = 0;
  const cookiePrefix = 'SSESS';
  const cookieSuffix = crypto
    .createHash('sha256')
    .update(hostname, 'utf8')
    .digest('hex')
    .substr(0, 32);
  let cookieSession = `${cookiePrefix}${cookieSuffix}`;
  req.cookieSessionText = '';
  if (!req.cookies[cookieSession]) {
    cookieSession = `SESS${cookieSuffix}`;
  }
  if (!req.cookies[cookieSession]) {
    next();
    return;
  }
  const session = req.cookies[cookieSession];
  const query = 'SELECT s.uid FROM sessions s WHERE s.sid = ?';
  let results = [];
  try {
    results = await executeQuery(db, query, [session]);
  } catch (error) {
    console.log(error);
  }

  // User session is valid, attach logged user id.
  if (results && results[0] && results[0].uid) {
    req.userId = results[0].uid;
    req.cookieSessionText = `${cookieSession}=${session}`;
    req.sessionId = session;
  }
  next();
};

export default middleware;
