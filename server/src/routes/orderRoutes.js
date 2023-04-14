const router = require("express").Router();
const {
  createOrder,
  makePayment,
  downloadFile,
  getOrderByUserId,
  getOrderByAdmin,
  getOrderByOrderId,
} = require("../controller/orderController");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  AdminAuthorization,
} = require("../middleware/auth");

router.post("/file/:fileId", verifyToken, createOrder);
router.post("/payment/:orderId", verifyToken, makePayment);
// router.get("/file/download/:token", verifyToken, downloadFile);
router.get("/user", verifyToken, getOrderByUserId);
router.get("/user/:orderId", verifyToken, getOrderByOrderId);
router.get("/admin", AdminAuthorization, getOrderByAdmin);

router.all("/*", (req, res) => {
  return res.status(404).send({
    status: false,
    msg: "This API request is not available! orderRoute",
  });
});

module.exports = router;
