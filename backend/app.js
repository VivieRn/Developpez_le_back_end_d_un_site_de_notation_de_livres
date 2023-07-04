//Logique général de l'application
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

const stuffRoute = require("./routes/stuff");
const userRoutes = require("./routes/user");
const { logger, logRequest, logError } = require("./middleware/logger");
const app = express();

//Database mangoDB
mongoose
  .connect(
    "mongodb+srv://vivierNicolas0:MyStrongPassword1@cluster0.xosnale.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Mesure de sécurité via Helmet, entête HTTPS et limitation des sources
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["self"],
    },
  })
);

app.use(logRequest);
app.use(logError);
app.use("/api/books", stuffRoute);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
