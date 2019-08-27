import crypto from 'crypto';

export function createDrupalToken(sessionId, privateKey, hashSalt, value) {
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

export default {
  createDrupalToken
};
