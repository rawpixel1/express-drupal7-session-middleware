import requestHandler from './requestHandler';

/**
 * @typedef {Object} DrupalSessionMiddlewareOptions
 * @property {string} backend only redis or knex are supported.
 * @property {import('knex').Knex} [knex] initialized knex client.
 * @property {import('redis')} [redis] initialized redis client.
 * @property {String} [redisCidPrefix='session_'] Redis CID prefix, default to `session_`.
 */

/**
 * Return an express middleware that will populate req.userId with the loggedIn drupal user uid.
 * @param {string} hostname - The Drupal base_url.
 * @param {DrupalSessionMiddlewareOptions} options - Options
 */
const middleware = (hostname, options) => async (req, res, next) => {
  req.sessionId = false;
  req.userId = 0;
  await requestHandler(hostname, options, req);
  next();
};

export default middleware;
