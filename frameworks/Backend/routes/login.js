const express = require("express");
const isAuth = require("../middleware/verifyJWT");

const { handleLogin } = require("../controllers/authController");
const { createUser } = require("../controllers/registerController");
const { handleReset, changePassword } = require("../controllers/resetPassword");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/login",
  [
    body("email").normalizeEmail().isEmail(),
    body("password").trim().notEmpty(),
  ],
  handleLogin
);
router.post(
  "/register",
  [
    body("email").normalizeEmail().isEmail(),
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("contactNumber").trim().isMobilePhone("he-IL"),
    body("password").trim().notEmpty(),
  ],
  createUser
);
router.post("/resetPassword", handleReset);
router.post(
  "/changePassword",
  [body("newPassword").notEmpty()],
  changePassword
); // this is for changing password after user receieves reset password and not in profile

module.exports = router;
