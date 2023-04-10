const Jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fileModel = require("../models/fileModel");
const orderModel = require("../models/orderModel");
require("dotenv").config();

const createOrder = async (req, res) => {
  try {
    let data = req.body;
    const { status } = data;

    const fileId = req.params.fileId;
    const userId = req.tokenDetails.userId;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!fileId) return res.status(400).json({ message: "fileId is required" });

    if (!mongoose.isValidObjectId(fileId))
      return res.status(400).json({ message: "Given FileId is not valid" });

    if (!mongoose.isValidObjectId(userId))
      return res.status(400).json({ message: "Given FileId is not valid" });

    const order = await orderModel.findOne({ userId: userId, fileId: fileId });

    console.log(order);
    if (order) {
      console.log("hj");
      return res
        .status(201)
        .send({ message: "order created successfully", data: order });
    }

    const file = await fileModel
      .findOne({ _id: fileId, isDeleted: false })
      .select("prize");

    let orderData = {
      userId: userId,
      fileId: fileId,
      amount: file.prize,
    };

    if (status) {
      if (!["pending", "completed", "cancelled"].includes(status))
        return res.status(400).json({ message: "Invalid status" });
      orderData.status = status;
    }
    // console.log(order);
    let createOrderData = await orderModel.create(orderData);
    // console.log(createOrderData);

    return res
      .status(201)
      .json({ message: "order created successfully", data: createOrderData });
  } catch (error) {
    // if(error.isJoi == true) error.status = 400
    console.log(error.message, "createOrder");
    // return res.status(error.status).json({message:error.message})
    return res.status(error).json({ message: error.message });
  }
};

const makePayment = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    const order = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: status } },
      { new: true }
    );

    const userID = order.userId;
    const fileID = order.fileId;

    const newToken = Jwt.sign(
      { userID: userID, fileID: fileID, orderId: orderId },
      process.env.JWTB,
      { expiresIn: 900 }
    );

    return res.status(200).send(newToken);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const userId = req.tokenDetails.userId;
    //   let userId = req.params.userId;
    const tokenId = req.params.token;

    Jwt.verify(tokenId, "checkForDownload", (err, userDetails) => {
      if (err) {
        return res.status(403).send({ message: err.message });
      }

      req.userDetails = userDetails;
    });

    //   console.log(req.userDetails.fileID);
    const userID = req.userDetails.userID;
    const fileID = req.userDetails.fileID;

    // console.log(userID);
    // console.log(userId);

    if (userId !== userID) {
      return res.status(401).send({
        message: "you are not authorized to download file",
      });
    }

    let file = await fileModel
      .findOne({
        _id: fileID,
        isDeleted: false,
      })
      .select("filePath");

    //   res.send(file.filePath);
    res.status(308).redirect(file.filePath);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
module.exports = { createOrder, makePayment, downloadFile };
