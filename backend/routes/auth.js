const express = require('express');
const router = express.Router();
const { signUp, logIn, logOut, whoami, signUpWithGoogle } = require("../controllers/auth");

router.post("/signUp", signUp);
router.post("/logIn", logIn);
router.post("/logOut", logOut);
router.post("/whoami", whoami);
router.post("/signUpWithGoogle", signUpWithGoogle);

module.exports = router;