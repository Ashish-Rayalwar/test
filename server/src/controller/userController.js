const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
require("dotenv").config();
const {
  userValidation,
  adminValidation,
  loginValidation,
} = require("../validations/validationSchema");

const bcrypt = require("bcryptjs");
let JWT = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  try {
    const data = req.body;
    const { email, role, password } = data;
    const responce = await adminValidation.validateAsync(data);
    const bcryptPass = await bcrypt.hash(data.password, 10);

    const findUser = await userModel.findOne({ email: email });
    if (!findUser) {
      const createAdmin = { email: email, password: bcryptPass, role: role };
      const create = await userModel.create(createAdmin);
      const { password, __v, ...rest } = create._doc;
      return res.status(201).json({ data: rest });
    } else {
      let findUser = await userModel.findOneAndUpdate(
        { email: email },
        { $set: { role: role } },
        { new: true }
      );
      const { password, __v, ...rest } = findUser._doc;
      return res.status(201).json({ data: rest });
    }
  } catch (error) {
    if (error.isJoi == true) error.status = 400;
    console.log(error.message, "craeteAdmin");
    return res.status(error.status).json({ message: error.message });
  }
};

const signupUser = async (req, res) => {
  try {
    const data = req.body;
    const { email, name } = data;

    const responce = await userValidation.validateAsync(data);
    const checkEmailExist = await userModel.findOne({ email: email });

    if (checkEmailExist)
      return res
        .status(409)
        .json({ message: "Email already exist, try different email" });
    const bcryptPass = await bcrypt.hash(data.password, 10);

    const userData = {
      name: name,
      email: email,
      password: bcryptPass,
    };

    const createUser = await userModel.create(userData);
    const { password, __v, ...rest } = createUser._doc;

    return res
      .status(201)
      .json({ message: "User registration successfull", data: rest });
  } catch (error) {
    if (error.isJoi == true) error.status = 400;
    console.log(error.message, "signup");
    return res.status(error.status).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const data = req.body;
    const { email } = data;

    const responce = await loginValidation.validateAsync(data);
    const checkEmailExist = await userModel.findOne({ email: email });
    if (!checkEmailExist)
      return res.status(404).json({ message: "User Not Found" });

    const userPassword = checkEmailExist.password;
    const originalPassword = await bcrypt.compare(data.password, userPassword);

    const userId = checkEmailExist._id;
    const role = checkEmailExist.role;

    if (!originalPassword)
      return res.status(401).json({
        status: false,
        message: "Incorrect password, plz provide valid password",
      });
    const { password, __v, ...rest } = checkEmailExist._doc;
    const token = JWT.sign({ userId: userId, role: role }, process.env.JWTA, {
      expiresIn: 86400,
    });
    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ message: "Login Success", data: rest });
  } catch (error) {
    if (error.isJoi == true) error.status = 400;

    console.log("error in loginUser", error.message);
    return res.status(error.status).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  // let token = req.cookies.token;
  // await Token.deleteOne({ token: token })
  let userId = req.tokenDetails.userId;
  await orderModel.deleteMany(
    { userId: userId, status: "pending" },
    { new: true }
  );

  res
    .clearCookie("token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send({ message: "User has been logged out." });
};

module.exports = { signupUser, loginUser, createAdmin, logout };
