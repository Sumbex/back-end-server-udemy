var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var HospSeguimiento = require('../models/hospSeguimiento');

// CREAR NUEVO SEGUIMIENTO
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var seguimiento = new HospSeguimiento({
        estado: body.estado,
        hospitalizacion: body.hospitalizacion
    });

    seguimiento.save((err, seguimientoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear seguimiento',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: seguimientoGuardado,
            });
        }
    });

});

// OBTENER SEGUIMIENTOS POR HOSPITALIZACION
app.get('/PorHospitalizacion', mdAutenticacion.verificaToken, (req, res) => {

    var idHospitalizacion = req.query.idHospitalizacion;

    HospSeguimiento.find({ hospitalizacion: idHospitalizacion })
        .populate('hospitalizacion')
        .exec(
            (err, seguimientos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando seguimientos',
                        errors: err
                    });
                }

                HospSeguimiento.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        seguimientos: seguimientos,
                        total: total
                    });
                });
            }
        )
});

module.exports = app;