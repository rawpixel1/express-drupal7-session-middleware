import 'core-js/stable';
import 'regenerator-runtime/runtime';
import middleware from './middleware';
import CSRFToken from './CSRFToken';
import userAccess from './userAccess';

const expressDrupal7 = {
  drupalExpressMiddleware: middleware,
  drupalCSRFToken: CSRFToken,
  drupalUserAccess: userAccess,
};

export default expressDrupal7;
export const drupalExpressMiddleware = middleware;
export const drupalCSRFToken = CSRFToken;
export const drupalUserAccess = userAccess;
