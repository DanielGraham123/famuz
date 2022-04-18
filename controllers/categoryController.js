const mainPages = require("../mainpages");
const cloudinary = require("../utils/cloudinary");
const Category = require("../models/category");

const category_index = (req, res) => {
  Category.find()
    .then((result) => {
      res.render("muz/categories/index", {
        title: "Muz Categories",
        mainPages,
        req_url: req.url,
        categories: result,
        categoryEdit: null,
      });
    })
    .catch((err) => console.log(err));
};

const category_new = async (req, res) => {
  try {
    console.log("try uploading ", req.body);
    // upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    console.log("creating a new category");

    // create a new category in db
    let category = new Category({
      name: req.body.title,
      image: req.body.cImage ? result.secure_url : "",
      cloudinary_id: req.body.cImage ? result.public_id : "",
    });

    console.log("awaiting cloudinary ");

    // save category
    await category.save();
    res.redirect("/muz-center/categories");
  } catch (err) {
    console.log(err);
  }
};

const category_edit = async (req, res) => {
  const id = req.params.id;

  try {
    console.log("try uploading edit: ", req.body, id);
    // upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }

    console.log("updating a new category");

    // create a new category in db
    const category = new Category({
      _id: id.trim(),
      name: req.body.title,
      image: req.body.cImage ? result.secure_url : "",
      cloudinary_id: req.body.cImage ? result.public_id : "",
    });

    await Category.findByIdAndUpdate(id.trim(), category, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("awaiting cloudinary ", data);
        res.redirect("/muz-center/categories");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const category_delete = async (req, res) => {
  const id = req.params.id;
  console.log("category delete", id);
  try {
    await Category.deleteOne({ _id: id }, (err, data) => {
      if (!err) {
        console.log(data);

        console.log("song successfully deleted");

        res.json(data);
      } else {
        console.error("error", err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const cat_edit = (req, res) => {
  console.log("cat_edit: ", req.body);
  const category = req.body;

  Category.find()
    .then((result) => {
      res.render("muz/categories/index", {
        title: "Muz Categories",
        mainPages,
        req_url: req.url,
        categories: result,
        categoryEdit: category,
      });
      console.log("trying to render");
    })
    .catch((err) => console.log(err));
};

module.exports = {
  category_index,
  category_new,
  category_edit,
  cat_edit,
  category_delete,
};
