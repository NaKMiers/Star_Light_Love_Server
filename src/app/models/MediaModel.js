const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MediaSchema = new Schema(
   {
      title: String,
      desc: String,
      source: { type: String, require: true },
      type: { type: String, require: true },
      userUploaded: { type: String, require: true },
      size: Number,
      path: String,
   },
   { timestamps: true }
)

module.exports = mongoose.model('media', MediaSchema)
