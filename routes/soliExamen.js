var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var SoliExamen = require('../models/soliExamen');


// CREAR NUEVA SOLICITUD
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var solicitud = new SoliExamen({
        tipoExamen: body.tipoExamen,
        fechaExamen: body.fechaExamen,
        datos: body.datos,
        estadoSolicitud: 1,
        usuario: body.usuario
    });

    solicitud.save((err, solicitudGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear solicitud',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: solicitudGuardada,
            });
        }
    });

});

// OBTENER SOLICITUDES POR PACIENTE
app.get('/PorPaciente', mdAutenticacion.verificaToken, (req, res) => {

    var idPaciente = req.query.idPaciente;

    SoliExamen.find({ usuario: idPaciente })
        .populate('usuario', 'nombre email')
        .populate('tipoExamen')
        .exec(
            (err, solicitudes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando solicitudes',
                        errors: err
                    });
                }

                SoliExamen.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        solicitudes: solicitudes,
                        total: total
                    });
                });
            }
        )
});

// OBTENER SOLICITUDES POR MEDICO
app.get('/PorMedico', mdAutenticacion.verificaToken, (req, res) => {

    var idMedico = req.query.idMedico;

    SoliExamen.find({ usuario: idMedico })
        .populate('usuario', 'nombre email')
        .populate('tipoExamen')
        .exec(
            (err, solicitudes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando solicitudes',
                        errors: err
                    });
                }

                SoliExamen.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        solicitudes: solicitudes,
                        total: total
                    });
                });
            }
        )
});

// OBTENER UNA SOLICITUD
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    SoliExamen.findById(id)
        .populate('usuario')
        .populate('tipoExamen')
        .exec((err, solicitud) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la solicitud',
                    errors: err
                });
            } if (!solicitud) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `La solicitud con el id: ${id} no existe`,
                    errors: { message: 'No existe una solicitud con ese ID' }
                });
            }
    
            return res.status(200).json({
                ok: true,
                solicitud: solicitud
            });
    
        });

});

// OBTENER TODAS LAS SOLICITUDES
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    SoliExamen.find()
        .populate('usuario', 'nombre email')
        .populate('tipoExamen')
        .exec(
            (err, solicitudes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando solicitudes',
                        errors: err
                    });
                }

                SoliExamen.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        solicitudes: solicitudes,
                        total: total
                    });
                });
            }
        )
});

module.exports = app;