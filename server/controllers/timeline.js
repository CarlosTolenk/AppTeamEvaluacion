const Timeline = require('../models/timeline');
const Tareas = require('../models/tareas');

const ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');
const async = require('async');

exports.tareaFinalizada = (req, res, next) => {
  let items = (tarea, callback) => {
    let timeline = new Timeline ({
      usuario : ObjectId(tarea.usuario.toString()),
      tarea : ObjectId(tarea._id.toString()),
      accion : 'Finalizó una Tarea',
      descripcion : tarea.descripcion,
      tipo : 'tarea'
    });

    timeline.save((err, item) => {
      if(!err){
        console.log("Accion Guardada");
        return callback(null, item);
      }
    });
  }
  async.map(req.body.tareas, items, (err,result) => {
    async.waterfall([
      function(callback) {
        Timeline.populate(result, {path : 'usuario', model : 'Usuario'}, function(err, items) {
          callback(null, items);
        });
      },
      function(items, callback) {
        Timeline.populate(items, {path: 'tarea', model : 'Tarea'}, function (err, items) {
          callback(null, items)
        });
      }
    ], function (err, data) {
      if(!err){
        res.send({populated : data, lean : req.body.tareas});
        console.log("Accion Guardada");
        console.log("tarea");
      }else{
        console.log(err);
      }
    });
  });
};

exports.recursoEnviado = (req, res, next) => {
  var timeline = new Timeline({
    recurso : req.body.recurso._id,
    accion : 'Compartio un Recurso',
    descripcion : req.body.recurso.asunto,
    tipo : 'recurso'
  });

  timeline.save((err, recurso) => {
    if(!err){
      console.log("Accion Guardada");
      console.log("recurso");
    }
  });
};

exports.getTimeline = (req, res, next) => {
  let d = new Date();
  let year = d.getFullYear();
  let mes = d.getMonth();
  let dia = d.getDate();
  console.log("Fecha: ", new Date(year, mes, dia));

  Timeline.find({fecha : {$gte : new Date(year, mes, dia)}})
    .populate('usuario tarea recurso')
      .exec((err, docs) => {
        if(!err){
          Timeline.populate(docs, {path : 'recurso.remitente', model: 'Usuario'}, function (err, items) {
            res.send(items);
          });
        }else {
          console.log(err);
        }
      });
};
