var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// BUSQUEDA POR COLECCION
app.get('/coleccion/:coleccion/:busqueda', mdAutenticacion.verificaToken, (req, res, next) => {
    var coleccion = req.params.coleccion;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    // Ttambien se puede hacer referencia a cada funcion de las promesas en una variable;

    switch (coleccion) {
        case 'hospitales':
            buscarHospitales(busqueda, regex).then(respuestas => {
                res.status(200).json({
                    ok: true,
                    hospitales: respuestas
                });
            });
            break;

        case 'medicos':
            buscarMedicos(busqueda, regex).then(respuestas => {
                res.status(200).json({
                    ok: true,
                    medicos: respuestas
                });
            });
            break;

        case 'usuarios':
            buscarUsuarios(busqueda, regex).then(respuestas => {
                res.status(200).json({
                    ok: true,
                    usuarios: respuestas
                });
            });
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda solo son, hospitales, medicos, hospitales'
            });
            break;
    }

});

// BUSQUEDA GENERAL
app.get('/todo/:busqueda', mdAutenticacion.verificaToken, (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });

});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });

    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });

    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email rut')
            .or([{ 'nombre': regex }, { 'rut': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });

    });

}

module.exports = app;