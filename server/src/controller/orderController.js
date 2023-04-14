const Jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fileModel = require("../models/fileModel");
const orderModel = require("../models/orderModel");
require("dotenv").config();
const axios = require("axios");

const createOrder = async (req, res) => {
  try {
    let data = req.body;
    const { status } = data;
    const fileId = req.params.fileId;

    console.log(fileId);
    const userId = req.tokenDetails.userId;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!fileId) return res.status(400).json({ message: "fileId is required" });

    if (!mongoose.isValidObjectId(fileId))
      return res.status(400).json({ message: "Given FileId is not valid" });

    if (!mongoose.isValidObjectId(userId))
      return res.status(400).json({ message: "Given userId is not valid" });

    const order = await orderModel
      .findOne({ userId: userId, fileId: fileId })
      .populate("fileId");

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

    let createOrderData = await orderModel.create(orderData);
    console.log(await createOrderData.populate("fileId"));
    // createOrderData.imgPath = file.imgPath;
    // console.log(createOrderData);

    return res.status(201).json({
      message: "order created successfully",
      data: createOrderData,
    });
  } catch (error) {
    // if(error.isJoi == true) error.status = 400
    console.log(error.message, "createOrder");
    // return res.status(error.status).json({message:error.message})
    return res.status(error).json({ message: error.message });
  }
};

const makePayment = async (req, res) => {
  try {
    console.log(req.body);
    const { status } = req.body;

    const orderId = req.params.orderId;

    const order = await orderModel
      .findOneAndUpdate(
        { _id: orderId },
        { $set: { status: status } },
        { new: true }
      )
      .populate("fileId");

    if (!order) {
      return res.status(404).send({ message: "No data found" });
    }
    const userID = order.userId;
    const fileID = order.fileId._id;
    console.log(userID);

    const createToken = () => {
      const newToken = Jwt.sign(
        { userID: userID, fileID: fileID, orderId: orderId },
        process.env.JWTB
        // { expiresIn: 10 }
      );
      return newToken;
    };

    const newToken = createToken();

    return res.status(200).send({ token: newToken, data: order });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

// const renewToken = () => {
//   let userId = req.tokenDetails.userId;
// };

const downloadFile = async (req, res) => {
  const userId = req.tokenDetails.userId;
  const { orderId, token } = req.body;

  if (!token) {
    const order = await orderModel.findOne({ _id: orderId }).populate("fileId");

    if (!order) {
      return res.status(404).send({ message: "No data found h" });
    }

    const userID = order.userId;
    const fileID = order.fileId._id;

    const createToken = () => {
      const newToken = Jwt.sign(
        { userID: userID, fileID: fileID, orderId: orderId },
        process.env.JWTB
        // { expiresIn: 10 }
      );
      return newToken;
    };

    const newToken = createToken();

    return res.send({
      url: `http://localhost:5000/api/file/download/${newToken}`,
    });
  }

  Jwt.verify(token, process.env.JWTB, async (err, userDetails) => {
    console.log(3);
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    req.userDetails = userDetails;

    const userID = req.userDetails.userID;
    if (!userID)
      return res.status(400).json({ message: "userId is not available" });
    const fileID = req.userDetails.fileID;
    if (!fileID)
      return res.status(400).json({ message: "fileID is not available" });
    console.log(5);

    console.log(userID);
    console.log(fileID);

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

    // return res.status(200).redirect(file.filePath);
    console.log("here");
    return res.send({
      url: `http://localhost:5000/api/file/download/${token}`,
    });
  });
};

const getDownload = async (req, res) => {
  let token = req.params.token;
  let userId = req.tokenDetails.userId;

  Jwt.verify(token, process.env.JWTB, async (err, userDetails) => {
    if (err) {
      console.log(err, "here");
      return res.status(400).send({ message: err.message });
    }
    req.userDetails = userDetails;

    const userID = req.userDetails.userID;
    if (!userID)
      return res.status(400).json({ message: "userId is not available" });
    const fileID = req.userDetails.fileID;
    if (!fileID)
      return res.status(400).json({ message: "fileID is not available" });

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

    return res.status(200).redirect(file.filePath);
    // return res.redirect({
    //   url: `http://localhost:5000/api/file/download/${token}`,
    // });
  });
};

const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.tokenDetails.userId;

    const orders = await orderModel
      .find({
        userId: userId,
        status: "completed",
      })
      .populate("fileId");
    if (orders.length === 0) {
      return res.status(404).send({ message: "No data found" });
    }

    return res.status(200).send({ data: orders });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};
const getOrderByOrderId = async (req, res) => {
  try {
    const userId = req.tokenDetails.userId;
    const orderId = req.params.orderId;
    console.log(orderId);
    console.log(userId);
    const orders = await orderModel
      .findOne({
        userId: userId,
        _id: orderId,
      })
      .populate("fileId");

    if (!orders) {
      return res.status(404).send({ message: "No data found" });
    }

    return res.status(200).send({ data: orders });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};

const getOrderByAdmin = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ status: "completed" })
      .populate("userId")
      .populate("fileId");
    if (orders.length === 0) {
      return res.status(404).send({ message: "No data found" });
    }

    return res.status(200).send({ data: orders });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({ message: error.message });
  }
};
module.exports = {
  createOrder,
  makePayment,
  downloadFile,
  getOrderByUserId,
  getOrderByAdmin,
  getOrderByOrderId,
  getDownload,
};
