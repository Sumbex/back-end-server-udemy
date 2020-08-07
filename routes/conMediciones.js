var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var ConMedicion = require('../models/conMediciones');

// CREAR NUEVA MEDICION
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medicion = new ConMedicion({
        estatura: body.estatura,
        peso: body.peso,
        temperatura: body.temperatura,
        presion: body.presion,
        frecuenciaCardiaca: body.frecuenciaCardiaca,
        frecuenciaRespiratoria: body.frecuenciaRespiratoria,
        atencion: body.atencion,
        usuario: body.usuario
    });

    medicion.save((err, medicionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear mediciones',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: medicionGuardada,
            });
        }
    });

});

// OBTENER MEDICIONES POR ATENCION
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    var idAtencion = req.query.idAtencion;

    ConMedicion.find({ atencion: idAtencion })
        .populate('usuario', 'nombre email')
        .exec(
            (err, mediciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando mediciones',
                        errors: err
                    });
                }

                ConMedicion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        mediciones: mediciones,
                        total: total
                    });
                });
            }
        )
});

// OBTENER MEDICIONES POR PACIENTE
app.get('/porPaciente', mdAutenticacion.verificaToken, (req, res) => {

    var idPaciente = req.query.idPaciente;

    ConMedicion.find({ usuario: idPaciente })
        .populate('usuario', 'nombre email')
        .exec(
            (err, mediciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando mediciones',
                        errors: err
                    });
                }

                ConMedicion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        mediciones: mediciones,
                        total: total
                    });
                });
            }
        )
});

module.exports = app;