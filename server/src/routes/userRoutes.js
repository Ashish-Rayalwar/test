const {
  signupUser,
  loginUser,
  createAdmin,
  logout,
} = require("../controller/userController");
const { verifyToken } = require("../middleware/auth");

const router = require("express").Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/admin", createAdmin);
router.post("/user/logout", verifyToken, logout);

router.all("/*", (req, res) => {
  return res.status(404).send({
    status: false,
    msg: "This API request is not available! useRoute",
  });
});

module.exports = router;
