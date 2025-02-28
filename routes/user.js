const express = require("express");
const router=express.Router();
const user=require("../models/user")
const wrapAsync=require("../utils/wrapAsync")
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController=require("../controllers/users")


router.get("/signup",userController.renderSignupForm);

router.get("/login",userController.renderLoginForm);

router.post("/signup",wrapAsync(userController.signUp));


router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login)

router.get("/logout",userController.logout);


module.exports=router;