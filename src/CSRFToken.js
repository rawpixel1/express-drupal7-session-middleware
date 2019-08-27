import PHPUnserialize from 'php-unserialize';
import KnexInstance from 'knex';
import { createDrupalToken } from './utils';

let privateKey = '';

/**
 * Return a drupal CSRF token.
 * @param {KnexInstance} knex - An instance of knex connected to the drupal database.
 * @param {String} sessionId - The drupal session id.
 * @param {String} hashSalt - The hashsalt from the drupal php config.
 * @param {String} value - The value to encode.
 */
export default async function getCSRFToken(knex, sessionId, hashSalt, value) {
  if (!sessionId) {
    return false;
  }
  if (!privateKey.length) {
    let results = [];
    try {
      results = await knex.raw('SELECT value FROM variable WHERE name = ?', ['drupal_private_key']);
    } catch (error) {
      console.log(error);
      return false;
    }
    if (!results || !results[0] || !results[0][0]) {
      return false;
    }
    try {
      privateKey = PHPUnserialize.unserialize(results[0][0].value);
    } catch (error) {
      console.log(error);
      return false;
    }
    if (!privateKey.length) {
      return false;
    }
  }

  return createDrupalToken(sessionId, privateKey, hashSalt, value);
}
