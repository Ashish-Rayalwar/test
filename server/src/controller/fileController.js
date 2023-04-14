const mongoose = require("mongoose");
const Joi = require("joi");
const validator = require("validator");
const fileModel = require("../models/fileModel");
const {
  fileValidation,
  fileUpdateValidation,
} = require("../validations/validationSchema");
const { uploadFile } = require("./aws");
const { isValidTitle } = require("../validations/validator");

const createFile = async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    const files = req.files;
    console.log(files);
    const responce = await fileValidation.validateAsync(data);
    if (files.length === 0 || files.length < 2)
      return res.status(400).json({ message: "provide file and image" });

    let imgURL;
    let fileUrl;

    for (let i of files) {
      if (i.fieldname == "filePath") {
        fileUrl = await uploadFile(i);
      }
      if (i.fieldname == "imgPath") {
        imgURL = await uploadFile(i);
      }
    }

    // let saveImg = {imgUrl:imgURL}
    data.imgPath = imgURL;
    data.filePath = fileUrl;

    const createFile = await fileModel.create(data);
    const { filePath, __v, ...rest } = createFile._doc;

    return res
      .status(201)
      .json({ message: "file Created successfully", data: rest });
  } catch (error) {
    if (error.isJoi == true) error.status = 400;
    console.log("error in fileCreate", error.message);
    return res.status(error.status).json({ message: error.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const data = req.query;
    const { title } = data;

    if (Object.keys(data).length === 0) {
      const getFiles = await fileModel
        .find({ isDeleted: false })
        .select("-filePath")
        .limit(20);

      if (getFiles.length === 0)
        return res.status(404).json({ message: "No files uploaded yet" });

      return res.status(200).json({ data: getFiles });
    }

    let filter = {
      isDeleted: false,
    };

    if (title) {
      filter.title = { $regex: title };
    }

    const getFiles = await fileModel.find(filter).select("-filePath");

    if (getFiles.length === 0)
      return res.status(404).json({ message: "No result found" });

    return res.status(200).json({ data: getFiles });
  } catch (error) {
    if (error.isJoi == true) error.status = 400;
    console.log("error in getFiles", error.message);
    return res.status(error.status).json({ message: error.message });
  }
};

const getFileById = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    if (!mongoose.isValidObjectId(fileId))
      return res.status(400).json({ message: "Given FileId is not valid" });

    const checkFileExist = await fileModel
      .findOne({ _id: fileId, isDeleted: false })
      .select("-filePath");

    if (!checkFileExist) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ data: checkFileExist });
  } catch (error) {
    console.log("error in getFileById", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const updateFilesById = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    let data = req.body;
    if (!mongoose.isValidObjectId(fileId))
      return res.status(400).json({ message: "Given FileId is not valid" });
    const files = req.files;
    const responce = await fileUpdateValidation.validateAsync(data);
    let fileUrl;
    let imgURL;
    if (files.length > 0) {
      for (let i of files) {
        if (i.fieldname == "filePath") {
          fileUrl = await uploadFile(i);
          data.filePath = fileUrl;
        }
        if (i.fieldname == "imgPath") {
          imgURL = await uploadFile(i);
          data.imgPath = imgURL;
        }
      }
    }

    const checkFileExist = await fileModel.findOneAndUpdate(
      { _id: fileId },
      data,
      { new: true }
    );

    if (!checkFileExist)
      return res.status(404).json({ message: "File not found" });

    return res
      .status(200)
      .json({ message: "file updated successfully", data: checkFileExist });
  } catch (error) {
    if (error.isJoi == true) error.status = 400;
    console.log("error in UpdateFile", error.message);
    return res.status(error.status).json({ message: error.message });
  }
};

const deleteFilesById = async (req, res) => {
  const fileId = req.params.fileId;

  if (!mongoose.isValidObjectId(fileId))
    return res.status(400).json({ message: "Given FileId is not valid" });

  await fileModel.findOneAndUpdate(
    { _id: fileId, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );

  return res.status(200).json({ message: "file deleted successfully" });
};

module.exports = {
  createFile,
  getFiles,
  getFileById,
  updateFilesById,
  deleteFilesById,
};
