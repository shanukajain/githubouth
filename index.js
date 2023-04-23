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
    clientID: "6219ab60fc4542cb8675",
    clientSecret: "5828ee27bfd7a166dc2e82e7e9d7bcb8d2e71cec",
    callbackURL: "http://localhost:4500/auth/github/callback",
    scope:"user:email"
  },
  async function(accessToken, refreshToken, profile, done) {
    // console.log(profile.displayName,profile.emails[0].value)
    var  name =  profile.displayName;
    let email = profile.emails[0].value
      let user;
      try {
        user = await UserModel.findOne({ email });
        if (user) {
          return done(null, user);
        }
        user = new UserModel({ name, email, password: uuid() });
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
    console.log(user);
    var token = jwt.sign({ email: user.email }, "Secret", {
      expiresIn: "1d",
    });
    console.log(token);
    res.redirect(
      `http://127.0.0.1:5501/QR_BOT/Frontend/index.html?id=${token}&name=${user.name}&email=${user.email}`
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

// ---------->>>>>>>> Github Credentials <<<<<<<<--------- //
// 5828ee27bfd7a166dc2e82e7e9d7bcb8d2e71cec
// 6219ab60fc4542cb8675