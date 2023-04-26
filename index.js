const express = require("express");
const app = express();

const { connection } = require("./config/db");
const { UserModel } = require("./models/user_model");

const passport = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;

const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");

// ---------->>>>>>>> Configure Strategy <<<<<<<<--------- //
passport.use(new GitHubStrategy({
    clientID: "76175954cd65e56e88fa",
    clientSecret: "315919d4efbfbf817f9042109383317790bd8483",
    callbackURL: "https://github-auth-my-wants.onrender.com/auth/github/callback",
    scope:"user:email"
  },
  async function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    var  name =  profile.displayName;
    let email = profile.emails[0].value
    let Username=profile.username
    let role="user";
    // console.log(name,email,Username,role)
      let user;
      try {
        user = await UserModel.findOne({ email });
        if (user) {
          return done(null, user);
        }

        user = new UserModel({ name, email, pass: uuid(),Username,role });
        await user.save();
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
  }
));

// ---------->>>>>>>> Authenticate Requests <<<<<<<<--------- //
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));



app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login',session: false, }),
  function(req, res) {
    // Successful authentication, redirect home.
    let user = req.user;
    // console.log(user);
    var token = jwt.sign({ userID: user._id,role:user.role}, "masai");
    console.log(token);
    res.redirect(
      `http://127.0.0.1:8000/Frontend/index.html?id=${token}&name=${user.name}&email=${user.email}`
    );
});

// ---------->>>>>>>> Connection <<<<<<<<--------- //
app.listen(4500, async () => {
    try {
      await connection;
      console.log("Connected to DB");
      console.log(`http://localhost:4500/`);
    } catch (error) {
      console.log("Error in Connecting to DB");
    }
  });

