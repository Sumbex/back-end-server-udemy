//Requires, importacion de librerias
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

//Inicializar variables
var app = express();

// CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Instancear Front
app.use(express.static(process.cwd() + "/dist/frontClinica"));

//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var atencionesRoutes = require('./routes/atenciones');
var dietasRoutes = require('./routes/dieta');
var nutReporteRoutes = require('./routes/nutReportes');
var psiSesionRoutes = require('./routes/psiSesion');
var conMedicionesRoutes = require('./routes/conMediciones');
var soliExamenRoutes = require('./routes/soliExamen');
var hospitalizacionesRoutes = require('./routes/hospitalizaciones');
var seguimientosRoutes = require('./routes/hospSeguimiento');
var recetasRoutes = require('./routes/recetas');
var configRoutes = require('./routes/config');
var configExamenesRoutes = require('./routes/configExamen');
var eventosRoutes = require('./routes/eventos');

//Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "/dist/frontClinica/index.html")
});

app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/atencion', atencionesRoutes);
app.use('/dieta', dietasRoutes);
app.use('/nutReporte', nutReporteRoutes);
app.use('/psiSesion', psiSesionRoutes);
app.use('/conMediciones', conMedicionesRoutes);
app.use('/soliExamenes', soliExamenRoutes);
app.use('/hospitalizaciones', hospitalizacionesRoutes);
app.use('/hospSeguimiento', seguimientosRoutes);
app.use('/recetas', recetasRoutes);
app.use('/config', configRoutes);
app.use('/configExamenes', configExamenesRoutes);
app.use('/eventos', eventosRoutes);
app.use('/', appRoutes);

//Escuchar peticiones con su puerto
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});