const mainPages = require("../mainpages");
const Song = require("../models/song");
const Category = require("../models/category");

const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");

const song_index = (req, res) => {
  if (req.method == "POST") {
    console.log("request query: ", req.body);
    // Song.find(
    //   {
    //     title: { $regex: req.body.query, $options: "i" },
    //   },
    //   (err, data) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log("Songs found: ", data);

    //       res.render("muz/songs/index", {
    //         title: "Songs",
    //         mainPages,
    //         req_url: req.url,
    //         songs: data,
    //       });
    //     }
    //   }
    // );

    if (req.body.query) {
      Song.find({ $text: { $search: req.body.query } }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Songs found: ", data);

          res.render("muz/songs/index", {
            title: "Songs",
            mainPages,
            req_url: req.url,
            songs: data,
          });
        }
      });
    } else if (req.body.filter) {
      console.log("in filter alph", req.body.filter);
      if (req.body.filter == "alph") {
        sort_alph(req, res);
      } else if (req.body.filter == "date") {
        sort_date(req, res);
      }
    }
  } else {
    Song.find()
      .then((result) => {
        console.log("Songs: ", result);

        res.render("muz/songs/index", {
          title: "Songs",
          mainPages,
          req_url: req.url,
          songs: result,
        });
      })
      .catch((err) => console.log(err));
  }
};

const sort_alph = (req, res) => {
  Song.find({}, null, { sort: { title: 1 } }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("sorting alphabetically: ", data);
      res.render("muz/songs/index", {
        title: "Songs",
        mainPages,
        req_url: req.url,
        songs: data,
      });
    }
  });
};

const sort_date = (req, res) => {
  Song.find({})
    .sort({ createdAt: "desc" })
    .then((result) => {
      console.log("sorting by date: ", result);
      res.render("muz/songs/index", {
        title: "Songs",
        mainPages,
        req_url: req.url,
        songs: result,
      });
    })
    .catch((err) => console.log(err));
};

const song_new = async (req, res) => {
  try {
    if (req.method == "POST") {
      // upload image to cloudinary
      let result;
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }

      console.log("in post new method", req.body);

      const newSong = new Song({
        title: req.body.title,
        category: req.body.category.toString(),
        author: req.body.author,
        description: req.body.description,
        url: req.body.url,
        lyrics: req.body.lyrics,
        image: req.body.image ? result.secure_url : "",
        songCloud_id: req.body.image ? result.public_id : "",
      });

      console.log("awaiting cloudinary ");

      // save new song
      // await category.save();
      await newSong
        .save()
        .then((result) => {
          res.redirect("/muz-center/songs");
        })
        .catch((err) => console.log(err));
    } else {
      console.log("in new songs");
      Category.find()
        .select("name")
        .then((result) => {
          console.log("categories: ", result);
          res.render("muz/songs/new", {
            title: "New Song",
            mainPages,
            req_url: req.url,
            categories: result,
          });
        })
        .catch((err) => console.log(err));
    }
  } catch (err) {
    console.log(err);
  }
};

const song_edit = async (req, res) => {
  const id = req.params.id;

  try {
    console.log("request type: ", req.method);
    console.log("request type edit: ", req.url);
    console.log("request type body: ", req.body);

    if (req.method == "POST") {
      console.log("trying to put method");
      // upload image to cloudinary
      let result = null;
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }

      console.log("in put edit method", req.body);

      const reqSong = new Song({
        _id: id,
        title: req.body.title,
        category: req.body.category.toString(),
        author: req.body.author,
        description: req.body.description,
        url: req.body.url,
        lyrics: req.body.lyrics,
        image: result ? result.secure_url : req.body.image,
        songCloud_id: result ? result.public_id : req.body.cloud_id,
      });

      await Song.findByIdAndUpdate(id, reqSong, (err, docs) => {
        if (err) {
          console.log("editing model", err);
        } else {
          console.log("Updated User : ", docs);

          res.redirect("/muz-center/songs/" + id);
        }
      });
    } else {
      Category.find()
        .select("name")
        .then((result) => {
          console.log("categories: ", result);
          console.log();
          console.log("category one: ", result[0]._id.toString());

          Song.findById(id)
            .then((response) => {
              console.log("this song: ", response);
              res.render("muz/songs/edit", {
                title: "Edit Song",
                mainPages,
                req_url: req.url,
                categories: result,
                song: response,
              });
            })
            .catch((err) => {
              console.error("song err:", err);
            });
        })
        .catch((err) => console.log("category error: ", err));
    }
  } catch (err) {
    console.log(err);
  }
};

const song_detail = async (req, res) => {
  const id = req.params.id;

  if (mongoose.Types.ObjectId.isValid(id)) {
    console.log("song details: ", id, req.url);

    await Song.findById(id)
      .populate("category")
      .then((result) => {
        console.log("song detail: ", result);

        res.render("muz/songs/details", {
          title: "Song Detail",
          mainPages,
          req_url: req.url,
          details: result,
        });
      })
      .catch((err) => console.log(err));
  } else {
    return false;
  }
};

const song_delete = async (req, res) => {
  const id = req.params.id;
  console.log("song delete", id);
  try {
    await Song.deleteOne({ _id: id }, (err, data) => {
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

module.exports = {
  song_index,
  song_detail,
  song_edit,
  song_new,
  song_delete,
};
