const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy;
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

passport.use(new TwitterStrategy(
	{
	consumerKey : 'thjdWeXT4As7C7bu2ag08HwUp',
	consumerSecret :'l5Wrbx02Tl3CrbOAW31716skmDXxgWQNk8AcAfnamEmMZojSer',
	callbackURL : 'http://127.0.0.1:3000/auth/twitter/callback'
 },

	(token, tokenSecret, profile, done) => {
		Usuario.findOne({nombre_usuario: profile.username})
			.exec((err, usuario) => {
				if(err){
					console.log(err);
					return done(err);
				}if(usuario){
					usuario.twitter = profile;
					usuario.save((err, user) => {
						if(err){
							return done(err);
						}
						done(null, user);
					});
				}else{
					new Usuario({
								nombre_usuario : profile.username,
								nombre : profile.displayName,
								twitter : profile
					  	}).save((err, usuario) => {
							if(!err){
								return done(null, usuario);
							}else{
								return done(err);
							}
					});
				}
			});
		}
 	)
);




module.exports = passport;
