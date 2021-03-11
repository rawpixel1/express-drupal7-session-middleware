// eslint-disable-next-line
import KnexInstance from 'knex';
import requestHandler from './requestHandler';

/**
 * Return an express middleware that will populate req.userId with the loggedIn drupal user uid.
 * @param {string} hostname - The Drupal base_url.
 * @param {KnexInstance} knex - An instance of knex connected to the drupal database.
 */
const middleware = (hostname, knex) => async (req, res, next) => {
  req.sessionId = false;
  req.userId = 0;
  await requestHandler(hostname, knex, req);
  next();
};

export default middleware;
