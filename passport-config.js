const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail) {
  // Function to authenticate users
  const authenticateUsers = async (email, password, done) => {
    // Get users by email
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user found with that email" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (e) {
      console.log("Error in authenticateUsers while comparing passwords: ", e);
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "email" }, authenticateUsers),
  );
  passport.serializeUser((user, done) => done(null, user.email));
  passport.deserializeUser(async (email, done) => {
    try {
      const user = await getUserByEmail(email);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = initialize;
