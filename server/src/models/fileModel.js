const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: true,
    },
    fileSize: {
      type: String,
      require: true,
    },
    prize: {
      type: Number,
      require: true,
      default: 0,
    },
    filePath: {
      type: String,
      require: true,
    },
    imgPath: {
      type: String,
      require: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    // imgPath:{
    //     type:String,
    //     require:true
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
