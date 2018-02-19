//Toda la creación y configuración del servidor de Node.js
/*<Step 1*/
var express = require('express'),
	app = express(),
	server = require('http').createServer(app);

var swig = require('swig');
/*Step 1>*/

/*<Step 2*/
var logger = require('morgan');
var bodyParser = require('body-parser');
/*Step 2>*/

/*<Step 1*/
//Asignamos un motor de templates a Node.js -- Swig
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Para no cachear HTML en el entorno de desarrollo
app.set('view cache', false);
//No cacheamos el HTML y asignamos por defecto tags diferentes para el render de Variables de Swig  (Mas adelante explicaremos porqué)
swig.setDefaults({ cache: false});
/*Step 1>*/

/*<Step 2*/
app.use(logger('dev'));
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

app.get('/partials/*', function(req, res) {
	console.log(req.params);
  	res.render('../../public/app/' + req.params['0']);
});

app.get('*', function(req, res) {
  	res.render('index');
});
/*Step 2>*/


/*<Step 1*/	
server.listen(3000, function(){
	console.log("Servidor corriendo en el puerto: 3000");
});
/*Step 1>*/