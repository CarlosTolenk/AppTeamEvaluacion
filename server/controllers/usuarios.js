// Requerir el modelo de los usuarios y passport para el registro y login
const Usuario = require('../models/usuarios');
const passport = require('../config/passport');

exports.registro = (req, res, next) => {
	var usuario = new Usuario(req.body);
	usuario.save((err, usuario) => {
		if (err) {
			res.send({success : false, message : err});
		}else{
			req.logIn(usuario,  (err) => {
				if (!err) {
					res.send({logged: true, success: true, usuario : req.session.passport});
				}else{
					console.log(err);
					res.send({logged: false, success: true, usuario : usuario});
				}
			});
		}
	});

};

// Proceso del login de forma local
exports.login =	 (req, res, next) => {
	var auth = passport.authenticate('local',  (err, user) => {
		if (err) {
			console.log(err);
			return next(err);
		}
		if(!user){
			console.log("No hay usuario!");
			res.send({success : false});
		}
		req.logIn(user, (err) => {
			if (err) {
				console.log("Error al loguearse!");
				return next(err)
			}
			res.send({success : true, user : user});
		});
	});
	auth(req, res, next);
};

// Ver si el usuario esta autentidado por medio de Session
exports.userAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.send({user : req.session.passport, isLogged : true});
	}else{
		res.send({user : {}, isLogged : false});
	}
};

// Cerrar session  y destruirla 
exports.logout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log("Logout");
		if (!err) {
			res.send({destroy : true});
		}else{
			console.log(err);
		}
	});
};
