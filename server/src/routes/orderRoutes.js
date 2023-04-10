const router = require("express").Router();
const {
  createOrder,
  makePayment,
  downloadFile,
} = require("../controller/orderController");
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middleware/auth");

router.post("/file/:fileId", verifyToken, createOrder);
router.post("/payment/:orderId", verifyToken, makePayment);
router.get("/file/download/:token", verifyToken, downloadFile);

router.all("/*", (req, res) => {
  return res.status(404).send({
    status: false,
    msg: "This API request is not available! orderRoute",
  });
});

module.exports = router;
