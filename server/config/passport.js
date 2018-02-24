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

//Ingresar con usuario de la red social twitter
passport.use(
	new TwitterStrategy(
		{
			consumerKey: 'ztnxw10c3iZy07BXYVMlgdR5k',
			consumerSecret: 'OdeeH7App41XoaplzqKaj9E934Dxox45cagmi90u9hixSlePwv',
			callbackURL: 'http://localhost:3000/auth/twitter/callback'
		},
		function (token, tokenSecret, profile, done) {
			Usuario.findOne({ nombre_usuario : profile.username })
			.exec(function (err, usuario){
				if (err) {
					console.log(err);
					return done(err);
				}
      var photo_toAdd = {
           path: "/usuarios/default.png",
        nombreArchivo: "default.png"
      };

      // Crear documento photo y usuario social en la bd mongodb.
       photoModule.create(photo_toAdd, function (err, photoModule) {
               if (err) console.log(err);


				if (usuario) {
					usuario.twitter = profile;
					usuario.photo = photoModule;
					usuario.save(function (err, user){
						if (err) {
							return done(err);
						}
						done(null, user);
					});
				}else{
					new Usuario ({
					nombre_usuario:profile.username,
					nombre: profile.displayName,
					photo:  photoModule,
					twitter: profile
					}).save(function(err,usuario){
					 if(!err)
					 {
					 return done(null, usuario);
					 }else{
					 return done(err);
					 }
					});

				}
               });
			});
		}
	)
);

module.exports = passport;
