import KnexInstance from 'knex';

/**
 * Similar to drupal user_access function.
 *
 * @param {KnexInstance} knex
 * @param {string} permission
 * @param {string} userId
 *
 * @returns {boolean}
 */
export default async function userAccess(knex, permission, userId) {
  let results = [];
  try {
    const query =
      'SELECT COUNT(r.rid) AS access FROM users u LEFT JOIN users_roles ur ON ur.uid = u.uid LEFT JOIN role_permission r ON ur.rid = r.rid WHERE r.permission = ? AND u.uid = ? AND r.rid IS NOT NULL';
    results = await knex.raw(query, [permission, userId]);
  } catch (error) {
    console.log(error);
    return false;
  }
  if (results && results[0] && results[0][0] && results[0][0].access) {
    return true;
  }

  return false;
}
