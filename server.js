if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const User = require("./models/User");
const Tree = require("./models/Tree");
const mongoose = require("mongoose");

initializePassport(passport, async (email) => {
  return User.findOne({ email });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connection established successfully"))
  .catch((error) => console.error("Failed to connect MongoDB:", error.message));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.get("/", checkAuthenticated, async (req, res) => {
  const trees = await Tree.find(); // Fetch all trees from the database
  res.render("index.ejs", { name: req.user.name, trees: trees });
});

app.get("/dashboard", checkAuthenticated, async (req, res) => {
  const sortOrder = req.query.sortOrder || "descending";
  const customerName = req.query.customerName;
  const sortQuery =
    sortOrder === "ascending" ? { emailCount: 1 } : { emailCount: -1 };

  let query;
  if (customerName) {
    // This uses a regular expression to perform a search that matches any part of the customerName and is case-insensitive
    query = Tree.find({ customerName: new RegExp(customerName, "i") });
  } else {
    query = Tree.find();
  }

  const trees = await query.sort(sortQuery);

  if (req.headers.accept === "application/json") {
    return res.json({ trees });
  }
  res.render("dashboard.ejs", { trees });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
);

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.get("/icon.svg", function (req, res) {
  res.sendFile(__dirname + "/public/img/icon.svg");
});

app.delete("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return console.error(err);
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
