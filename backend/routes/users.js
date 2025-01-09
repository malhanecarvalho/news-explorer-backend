const router = require("express").Router();
const auth = require('../middleware/auth');

const {
  getAllUsers,
  getCurrentUser,
  getUserById,
  deleteUsers,
} = require("../controllers/userControllers");

router.get("/", auth, getAllUsers);
router.get("/me/:_id", auth, getCurrentUser);
router.get("/me/:_id", auth, getUserById);
router.delete("/me/:_id", auth, deleteUsers);

module.exports = router;