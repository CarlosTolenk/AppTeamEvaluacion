const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy;
const Usuario = require('../models/usuarios');

passport.serializeUser((user, done) => {
	if (user) {
		done(null, user);
	}
});

passport.deserializeUser((user, done) => {
	Usuario.findOne({_id : user._id})
	.exec((err, user) => {
		if(user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
	});
});

//Revisando si existe el usuario y autenticando el password
passport.use('local',new LocalStrategy(
	(username, password, done) => {
		Usuario.findOne({nombre_usuario : username})
		.exec((err, user) => {
			if (user && user.authenticate(password)) {
				return done(null, user)
			}else{
				return done(null, false)
			}
		})
	}
));

module.exports = passport;
