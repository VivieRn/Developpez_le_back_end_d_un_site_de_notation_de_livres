const helmet = require("helmet");

// Fonction middleware pour HSTS
const hstsMiddleware = helmet.hsts({
  maxAge: 5184000,
  includeSubDomains: true,
});

// Fonction middleware pour Content Security Policy
const contentSecurityPolicyMiddleware = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["self"],
    imgSrc: ["'self'"],
  },
});

module.exports = {
  hstsMiddleware,
  contentSecurityPolicyMiddleware,
};
