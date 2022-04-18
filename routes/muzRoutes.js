const express = require("express");
const router = express.Router();
const muzController = require("../controllers/muzController");
const songRoutes = require("./songRoutes");
const categoryRoutes = require("./categoryRoutes");

router.get("/", muzController.muz_index);
router.use("/songs", songRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
