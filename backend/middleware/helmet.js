const helmet = require("helmet");

// Fonction middleware pour HSTS
const hstsMiddleware = helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
});

// Fonction middleware pour Content Security Policy
const contentSecurityPolicyMiddleware = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["self"],
  },
});

// Fonction middleware xXssProtection
function xXssProtection(options) {
  options = options || {};

  var headerValue = "1; mode=block";

  if (options.setOnOldIE) {
    return function xXssProtection(req, res, next) {
      var matches = /msie\s*(\d+)/i.exec(req.headers["user-agent"]);
      var value;

      if (!matches || parseFloat(matches[1]) >= 9) {
        value = headerValue;
      } else {
        value = "0"; // Si le navigateur est <= IE8
      }

      // Force l'en-tête X-XSS-Protection pour les anciennes versions d'IE
      if (value === "0") {
        res.setHeader("X-XSS-Protection", "0");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Content-Security-Policy", "default-src 'self'");
      } else {
        res.setHeader("X-XSS-Protection", value);
      }

      next(); // On appelle le middleware suivant
    };
  } else {
    return function xXssProtection(req, res, next) {
      var matches = /msie\s*(\d+)/i.exec(req.headers["user-agent"]);
      var value;

      if (!matches || parseFloat(matches[1]) >= 9) {
        value = headerValue;
      } else {
        value = "0"; // Si le navigateur est <= IE8
      }

      res.setHeader("X-XSS-Protection", value); // Ajout de l'en-tête X-XSS-Protection
      next(); // On appelle le middleware suivant
    };
  }
}

module.exports = {
  hstsMiddleware,
  contentSecurityPolicyMiddleware,
  xXssProtection,
};
