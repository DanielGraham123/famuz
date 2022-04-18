const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

const uploatUtil = require("../utils/multer");

router.get("/", categoryController.category_index);

router.post("/cat_edit", categoryController.cat_edit);

// post category info to mongodb & cloudinary
router.post("/", uploatUtil.single("cImage"), categoryController.category_new);

router.post(
  "/:id",
  uploatUtil.single("cImage"),
  categoryController.category_edit
);

router.delete("/:id", categoryController.category_delete);

module.exports = router;
