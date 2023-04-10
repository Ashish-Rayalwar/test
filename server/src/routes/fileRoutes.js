const {
  createFile,
  getFiles,
  getFileById,
  updateFilesById,
  deleteFilesById,
} = require("../controller/fileCOntroller");
const {
  AdminAuthorization,
  verifyTokenAndAuthorization,
} = require("../middleware/auth");

const router = require("express").Router();

router.post("/files", AdminAuthorization, createFile);
router.get("/files", getFiles);
router.get("/files/:fileId", getFileById);
router.put("/files/:fileId", AdminAuthorization, updateFilesById);
router.delete("/files/:fileId", AdminAuthorization, deleteFilesById);

router.all("/*", (req, res) => {
  return res.status(404).send({
    status: false,
    msg: "This API request is not available! FileRoute",
  });
});

module.exports = router;
