const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // console.log(token);
    if (!token)
      return res
        .status(400)
        .send({ status: false, message: "You are not loggedIn" });

    if (token) {
      JWT.verify(token, process.env.JWTA, (err, tokenDetails) => {
        if (err) {
          return res.status(403).send({ status: false, message: err.message });
        }
        req.tokenDetails = tokenDetails;
        next();
      });
    } else {
      return res
        .status(401)
        .send({ status: false, msg: "you are not authenticated" });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
    console.log("error in verifyToken", error.message);
  }
};

// const downloadFileVerify = async (req,res,next)=>{
//   const userId = req.tokenDetails.userId;

//   const tokenId = req.params.token;
//     JWT.verify(tokenId, process.env.JWTB, (err, userDetails) => {
//       if (err) {
//         return res.status(403).send({ status: false, message: err.message });
//       }

//       req.tokenDetails = tokenDetails;
//       next();
//     });
// }

const AdminAuthorization = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      let fileId = req.params.fileId;
      // console.log(req.tokenDetails);
      if (fileId) {
        if (!mongoose.isValidObjectId(fileId))
          return res.status(400).json({ message: "Given FileId is not valid" });
      }
      console.log(req.tokenDetails.role);
      if (req.tokenDetails.role == "admin") {
        next();
      } else {
        res.status(403).send({
          status: false,
          message: "you are not authorized to perform this task",
        });
      }
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
    console.log("error in verifyTokenAndAuthorization", error.message);
  }
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  try {
    verifyToken(req, res, async () => {
      let fileId = req.params.fileId;
      if (!mongoose.isValidObjectId(fileId))
        return res.status(400).json({ message: "Given FileId is not valid" });
      //   let userId = req.params.userId;
      // console.log(req.tokenDetails.userId, "jno");
      if (req.tokenDetails.userId) {
        next();
      } else {
        res.status(403).send({
          status: false,
          message: "you are not authorized to perform this task",
        });
      }
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
    console.log("error in verifyTokenAndAuthorization", error.message);
  }
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  AdminAuthorization,
};
