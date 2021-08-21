import crypto from 'crypto';

/**
 * Return an express middleware that will populate req.userId with the loggedIn drupal user uid.
 * @param {string} hostname - The Drupal base_url.
 * @param {import('./middleware').DrupalSessionMiddlewareOptions} options
 * @param {import('knex').Knex} knex - An instance of knex connected to the drupal database.
 * @param {Object} req - a node http request object, must have req.cookies parsed object.
 */
module.exports = async (hostname, { backend = 'knex', redisCidPrefix = 'session_', ...client }, req) => {
  const cookiePrefix = 'SSESS';
  const cookieSuffix = crypto.createHash('sha256').update(hostname, 'utf8').digest('hex').substr(0, 32);
  let cookieSession = `${cookiePrefix}${cookieSuffix}`;
  req.cookieSessionText = '';
  if (!req.cookies[cookieSession]) {
    cookieSession = `SESS${cookieSuffix}`;
  }
  if (!req.cookies[cookieSession]) {
    return;
  }

  req.userId = 0;
  req.sessionTimestamp = 0;
  req.cookieSessionText = null;
  req.sessionId = null;

  const session = req.cookies[cookieSession];
  if (backend === 'knex') {
    const query = 'SELECT s.uid, s.timestamp FROM sessions s WHERE s.sid = ?';
    let results = [];
    try {
      results = await client.knex.raw(query, [session]);
    } catch (error) {
      console.error(error);
    }

    // User session is valid, attach logged user id.
    if (results && results[0] && results[0][0] && results[0][0].uid) {
      req.userId = parseInt(results[0][0].uid, 10) > 0 ? parseInt(results[0][0].uid, 10) : 0;
      req.sessionTimestamp = parseInt(results[0][0].timestamp, 10) > 0 ? parseInt(results[0][0].timestamp, 10) : 0;
      req.cookieSessionText = `${cookieSession}=${session}`;
      req.sessionId = session;
    }
  } else if (backend === 'redis') {
    client.get(`${redisCidPrefix}${session}`, (data) => {
      console.log(data);
    });
  }
};
