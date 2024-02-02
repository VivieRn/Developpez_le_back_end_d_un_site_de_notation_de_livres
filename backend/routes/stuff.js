// Logiques général des routes
const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

const stuffCtrl = require("../controllers/stuff");

router.get("/bestrating", stuffCtrl.getBestrating);

router.post("/", auth, multer, stuffCtrl.createThing);

router.post("/:id/rating", auth, stuffCtrl.setBookRating);

router.put("/:id", auth, stuffCtrl.modifyThing);

router.delete("/:id", auth, stuffCtrl.deleteThing);

router.get("/:id", stuffCtrl.getOneThing);

router.get("/", stuffCtrl.getAllThings);

module.exports = router;
