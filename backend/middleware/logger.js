const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "JournalLog/app.log" })],
});

const formatTimestamp = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const logRequest = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const timestamp = formatTimestamp();
  const message = `[${timestamp}] [${req.method}] IP: ${ip} - ${req.originalUrl}`;
  logger.info(message);
  next();
};

const logError = (err, req, res, next) => {
  logger.error(`Une erreur s'est produite : ${err.message}`);
  next(err);
};

module.exports = { logger, logRequest, logError };
