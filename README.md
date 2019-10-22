Express middleware to retrieve a user session from a drupal 7 cookie

# Install

[![Greenkeeper badge](https://badges.greenkeeper.io/rawpixel1/express-drupal7-session-middleware.svg)](https://greenkeeper.io/)

`npm i express-drupal7-session-middleware`

You need to use knex query builder to use this package.

`npm i cookie-parser knex`

See knex documentation on how to create a new instance.

# Usage

In your server definition
```javascript

  const { drupalExpressMiddleware } = require('express-drupal7-session-middleware');

  app.httpServer = http.createServer(app);
  // ...
  app.use(cookieParser());
  app.use(drupalExpressMiddleware('local.my-website.com', knex));

```

then in your routes
```javascript
  const { drupalUserAccess, drupalCSRFToken } = require('express-drupal7-session-middleware');

  const myRoute = async (req, res) => {
    const access = await drupalUserAccess(knex, 'access api myRoute', req.userId);
    if (!access) {
      return res.status(403).send();
    }

    // Bonus if you need it
    console.log(req.cookieSessionText);
    // -- and --
    const drupalHashSalt = 'fwf3qfwgrbq34h34qeg134g3434g5340f-0f';
    const csrfToken = await drupalCSRFToken(knex, req.sessionId, drupalHashSalt, 'services'));
    res.json({ csrfToken });
  }
```
