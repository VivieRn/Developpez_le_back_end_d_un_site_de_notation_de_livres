const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: "JournalLog/app.log" })],
});

const logRequest = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();
  const message = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ip,
    headers: req.headers,
    query: req.query,
    status: res.statusCode, // Ajouter le statut de la réponse
    request: req.body,
  };
  logger.info(JSON.stringify(message, null, 2));
  next();
};

const logError = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const message = {
    timestamp,
    error: {
      message: err.message,
      stack: err.stack,
    },
  };
  logger.error(JSON.stringify(message, null, 2));
  next(err);
};

module.exports = { logger, logRequest, logError };
