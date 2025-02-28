const user = require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render('users/signup.ejs')
};

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs')
};

module.exports.signUp=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newuser=new user({username,email,password})
       const registerdUser= await user.register(newuser,password);
       console.log(registerdUser)

       req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess","Welcome to wanderlust");
        res.redirect("/listings")
       })
}catch(e){
    req.flash("error",e.message);
    res.redirect('/signup')
}
};

module.exports.login= async(req,res)=>{
    req.flash("sucess","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl)
    };

module,exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("sucess","you are logged out!");
        res.redirect("/listings");
    })
}