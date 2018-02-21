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
