const passport = require('passport');
const Usuario = require('../models/usuarios');

passport.serializeUser((user, done) => {
    if(user){
      done(null, user);
    }
});

passport.deserializeUser((user, done) => {
    Usuario.findOne({_id:user._id})
      .exec((err, user) => {
        if(user){
          return done(null, user);
        }else{
          return done(null, false);
        }
      });
});

module.exports = passport;
