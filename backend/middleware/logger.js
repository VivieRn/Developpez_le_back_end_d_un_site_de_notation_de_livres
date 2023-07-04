const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "JournalLog/app.log" })],
});

const logRequest = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const message = `[${req.method}] IP: ${ip} - ${req.originalUrl}`;
  logger.info(message);
  next();
};

const logError = (err, req, res, next) => {
  logger.error(`Une erreur s'est produite : ${err.message}`);
  next(err);
};

module.exports = { logger, logRequest, logError };
