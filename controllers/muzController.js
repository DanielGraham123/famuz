const mainPages = require("../mainpages");

const muz_index = (req, res) => {
  res.render("muz/index", {
    title: "Muz Center",
    mainPages,
    req_url: req.url,
  });
};

const muz_songs = (req, res) => {
  res.render("muz/songs/index", {
    title: "Muz Songs",
    mainPages,
    req_url: req.url,
  });
};

const muz_categories = (req, res) => {
  res.render("muz/categories/index", {
    title: "Muz Categories",
    mainPages,
    req_url: req.url,
  });
};

module.exports = {
  muz_index,
  muz_songs,
  muz_categories,
};
