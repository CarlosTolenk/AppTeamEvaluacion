const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;;
const Usuario = require('../models/usuarios');

//Serializando Passport para recibir los usuarios
passport.serializeUser((user, done)  => {
	if (user) {
		done(null, user);
	}
});

//Busca usuarios
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

//Ingresando al LocalStrategy los usuarios para guardar la session del usuario
passport.use('local', new LocalStrategy(
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
