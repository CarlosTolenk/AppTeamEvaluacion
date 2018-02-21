const Usuario = require('../models/usuarios');
const passport = require('../config/passport');

exports.registro = (req, res, next) => {
    let usuario = new Usuario(req.body);
    //Revisar si esa da algun error
    usuario.save((err, usuario) => {
      if(err){
        res.send({success: false, message: err});
      }else{
        req.logIn(usuario, (err) => {
          if(!err){
            res.send({logged:true, success:true, usuario : req.session.passport});
          }else{
            console.log(err);
            res.send({logged:false, success:true, usuario : usuario});
          }
        });
      }
    });
 };

 exports.login = (req, res, next) => {
   let auth = passport.authenticate('local', (err, user) => {
        if(err){
          console.log(err);
          return next(err);
        }
        if(!user){
          console.log("No hay usuario");
          res.send({ success: false });
        }else{
          req.logIn(user, (err) => {
            if(err){
              console.log("Error al loguearse");
              return next(err);
            }
            res.send({ success: true, user: user});
          });
        }
   });

   auth(req, res, next);
 };

 exports.userAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
      res.send({ user: req.session.passport, isLogged: true});
    }else{
      res.send({ user: {}, isLogged: false });
    }
 };

 exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log("Logout");
        if(!err){
          res.send({ destroy: true});
        }else{
          console.log(err);
        }
    });
 };
