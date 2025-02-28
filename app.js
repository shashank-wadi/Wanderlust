if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const Review = require("./models/review");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const listingsRouter = require("./routes/listing");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { date } = require("joi");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user");
const userRouter = require("./routes/user");

const dbUrl = process.env.MONGODB_URl;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in mongo Session Store", err);
});
const sessionOption = {
  store,
  secret: process.env.SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    expires: Date.now() + 24 * 60 * 60 * 1000,
    maxAge: 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOption));
const port = 8080;

// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MongoDB Connection
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// Routes
const flash = require("connect-flash");
const { isLoggedIn } = require("./middleware");
const { title } = require("process");
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/", userRouter);

app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.query;
    if (!searchQuery) {
      return res.redirect("/listings");
    }
    const results = await Listing.find({
      title: { $regex: searchQuery, $options: "i" },
    });

    if (results.length === 0) {
      req.flash("error", "No listings found for your search.");
      return res.redirect("/listings");
    }
    res.render("searchResults", { results, searchQuery });
  } catch (err) {
    console.error("Search error:", err);
    res.redirect("/listings");
  }
});

// Catch-All 404 Route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// Start Server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
