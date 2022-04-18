const express = require("express");
const router = express.Router();
const songController = require("../controllers/songController");
const uploatUtil = require("../utils/multer");

router.get("/", songController.song_index);
router.get("/new", songController.song_new);
router.get("/:id", songController.song_detail);

router.post("/", songController.song_index);

router.post("/edit/:id", uploatUtil.single("image"), songController.song_edit);
router.get("/edit/:id", songController.song_edit);

router.post("/new", uploatUtil.single("image"), songController.song_new);

router.delete("/:id", songController.song_delete);

module.exports = router;
