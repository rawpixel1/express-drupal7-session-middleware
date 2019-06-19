import crypto from 'crypto';
import KnexInstance from 'knex';

/**
 * Return an express middleware that will populate req.userId with the loggedIn drupal user uid.
 * @param {string} hostname - The Drupal base_url.
 * @param {KnexInstance} knex - An instance of knex connected to the drupal database.
 */
const middleware = (hostname, knex) => async (req, res, next) => {
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
    results = await knex.raw(query, [session]);
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
