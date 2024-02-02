// Logique général de l'application
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const stuffRoute = require("./routes/stuff");
const userRoutes = require("./routes/user");
const { logRequest, logError } = require("./middleware/logger");
const {
  hstsMiddleware,
  contentSecurityPolicyMiddleware,
} = require("./middleware/helmet");
const {
  checkRequest,
  blockExcessiveRangeRequests,
} = require("./middleware/ratelimit");

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
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Middleware de sécurité
app.use(hstsMiddleware);
app.use(contentSecurityPolicyMiddleware);

// Middleware de log
app.use(logRequest);
app.use(logError);

// Middleware de limitation de débit
app.use(blockExcessiveRangeRequests);
app.use(checkRequest);

//Définitions des routes et de leurs comportements
app.use("/api/books", stuffRoute);
app.use("/api/auth", userRoutes);

// Servir des fichiers statiques
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
