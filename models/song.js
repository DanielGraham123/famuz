const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    author: {
      type: String,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    lyrics: {
      type: String,
    },
    songCloud_id: {
      type: String,
    },
  },
  { timestamps: true }
);

songSchema.index({ "$**": "text" });

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
