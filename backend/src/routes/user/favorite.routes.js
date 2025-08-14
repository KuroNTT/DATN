const express = require("express");
const router = express.Router();


const favoriteController = require("../../controllers/user/favorite.controller");

router.post("/toggle", favoriteController.toggleFavorite);
router.get("/", favoriteController.getFavoritesByUser);
module.exports = router;
