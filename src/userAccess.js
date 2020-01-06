import KnexInstance from 'knex';
import NodeCache from 'node-cache';

const localCache = new NodeCache({
  stdTTL: 60 * 30, // 30 minutes default.
  deleteOnExpire: true
});

/**
 * Similar to drupal user_access function.
 *
 * @param {KnexInstance} knex
 * @param {string} permission
 * @param {string} userId
 *
 * @returns {boolean}
 */
export default async function userAccess(knex, permission, userId, cache = true) {
  let results = [];

  const cacheKey = `${userId}__${permission}`;

  let access = localCache.get(cacheKey);
  if (typeof access !== 'undefined') {
    return access;
  }

  try {
    const query =
      'SELECT COUNT(r.rid) AS access FROM users u LEFT JOIN users_roles ur ON ur.uid = u.uid LEFT JOIN role_permission r ON ur.rid = r.rid WHERE r.permission = ? AND u.uid = ? AND r.rid IS NOT NULL';
    results = await knex.raw(query, [permission, userId]);
  } catch (error) {
    console.log(error);
    // Do not cache on error.
    return false;
  }
  if (results && results[0] && results[0][0] && results[0][0].access) {
    return true;
  }

  // Check results
  if (results && results[0] && results[0][0] && results[0][0].access) {
    access = true;
  } else {
    access = false;
  }

  // set cache
  localCache.set(cacheKey, access, 60 * 30); // 30 minutes TTL default

  return access;
}
