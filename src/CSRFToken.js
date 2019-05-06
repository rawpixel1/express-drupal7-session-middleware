import PHPUnserialize from 'php-unserialize';
import crypto from 'crypto';
import { executeQuery } from './helpers';

let privateKey = '';

export default async function getCSRFToken(db, sessionId, hashSalt, value) {
  if (!sessionId) {
    return false;
  }
  if (!privateKey.length) {
    let privateKeyResults = [];
    try {
      privateKeyResults = await executeQuery(db, 'SELECT value FROM variable WHERE name = ?', ['drupal_private_key']);
    } catch (error) {
      console.log(error);
      return false;
    }
    if (!privateKeyResults || !privateKeyResults[0]) {
      return false;
    }
    try {
      privateKey = PHPUnserialize.unserialize(privateKeyResults[0].value);
    } catch (error) {
      console.log(error);
      return false;
    }
    if (!privateKey.length) {
      return false;
    }
  }

  const key = `${sessionId}${privateKey}${hashSalt}`;

  const token = crypto
    .createHmac('sha256', key)
    .update(value)
    .digest()
    .toString('base64');

  return token
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
