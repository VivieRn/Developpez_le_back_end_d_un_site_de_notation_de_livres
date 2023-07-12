const RateLimiter = require("ratelimiter");
const { logger, logError } = require("./logger");

const requestInfoMap = new Map();

function checkRequest(req, res, next) {
  const ip = req.ip;
  const url = req.originalUrl;
  try {
    // Exception pour le serveur
    if (url.startsWith("/api/books" || "/images")) {
      return next();
    }

    const now = Date.now();
    const limitDuration = 5 * 60 * 1000; // 5 minutes

    // Vérifie si l'adresse IP est déjà dans Map
    if (requestInfoMap.has(ip)) {
      const requestInfo = requestInfoMap.get(ip);

      // Vérifie si la limité de temps est passée
      if (now - requestInfo.startTime > limitDuration) {
        // Reset tde la limite
        requestInfo.count = 1;
        requestInfo.startTime = now;
      } else if (requestInfo.count >= 100) {
        // Bloque l'IP et l'enregistre dans les logs
        logger.info(`Blocking IP: ${ip}`);
        res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
        return;
      } else {
        // Ajoute 1 au compteur
        requestInfo.count += 1;
      }
    } else {
      requestInfoMap.set(ip, { count: 1, startTime: now });
    }

    return next();
  } catch (error) {
    logError(error, req, res, next);
    res.status(500).json({ message: "An error occurred." });
  }
}

function blockExcessiveRangeRequests(req, res, next) {
  const rangeHeader = req.headers["range"];

  if (rangeHeader) {
    const ranges = rangeHeader.split(",");

    if (ranges.length > 10) {
      res.status(416).json({ message: "Requested Range Not Satisfiable" });
      logger.info("Requested Range Not Satisfiable");
      return;
    }
  }

  next();
}

module.exports = { checkRequest, blockExcessiveRangeRequests };
