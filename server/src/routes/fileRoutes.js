const {
  createFile,
  getFiles,
  getFileById,
  updateFilesById,
  deleteFilesById,
} = require("../controller/fileCOntroller");
const { downloadFile, getDownload } = require("../controller/orderController");
const {
  AdminAuthorization,
  verifyTokenAndAuthorization,
  verifyToken,
} = require("../middleware/auth");

const router = require("express").Router();

router.post("/files", AdminAuthorization, createFile);
router.get("/files", getFiles);
router.get("/files/:fileId", getFileById);
router.put("/files/:fileId", AdminAuthorization, updateFilesById);
router.delete("/files/:fileId", AdminAuthorization, deleteFilesById);
router.post("/file/download", verifyToken, downloadFile);
router.get("/file/download/:token", verifyToken, getDownload);

router.all("/*", (req, res) => {
  return res.status(404).send({
    status: false,
    message: "This API request is not available! FileRoute",
  });
});

module.exports = router;
