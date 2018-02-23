const Tareas = require('../models/tareas');
const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');

exports.guardar = (req, res, next) => {
    let tareas = new Tareas({
      descripcion: req.body.descripcion,
      usuario : req.session.passport.user._id.toString()
    });

    tareas.save((err, tarea) => {
        if(err){
          console.log("err: " + err);
          res.send({ success: false, message: err });
        }else{
          console.log("Guardado con Exito");
          res.send({ success: true, tarea: tarea})
        }
    });
};

exports.getTareas = (req, res, next) => {
    Tareas.find({ usuario: req.session.passport.user._id.toString()})
      .exec((err, tareas) =>{
        if(err){
          console.log(err);
        }else{
          res.send(tareas);
        }
      });
};

exports.guardarFinalizadas = (req, res, next) => {
    let ids = req.body.ids;

    Tareas.find({_id: {$in :ids}})
      .exec((err, tareas) =>{
        if(err){
          console.log(err);
        }else{
          _.each(tareas, (tarea) =>{
            tarea.finalizada.estado = true;
            tarea.finalizada.fecha = new Date();
            tarea.save();
          });
          req.body.tareas = tareas;
         //res.send(tareas);
          next();
        }
      });
};
