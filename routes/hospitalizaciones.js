var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var Hospitalizacion = require('../models/hospitalizaciones');

// CREAR NUEVA HOSPITALIZACION
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospitalizacion = new Hospitalizacion({
        motivo: body.motivo,
        atencion: body.atencion,
        usuario: body.usuario,
        medico: req.medico._id
    });

    hospitalizacion.save((err, hospitalizacionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospitalizacion',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: hospitalizacionGuardada,
            });
        }
    });

});

// OBTENER SOLICITUDES POR PACIENTE
app.get('/PorPaciente', mdAutenticacion.verificaToken, (req, res) => {

    var idPaciente = req.query.idPaciente;

    Hospitalizacion.find({ usuario: idPaciente })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, hospitalizaciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitalizaciones',
                        errors: err
                    });
                }

                Hospitalizacion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        hospitalizaciones: hospitalizaciones,
                        total: total
                    });
                });
            }
        )
});

// OBTENER SOLICITUDES POR MEDICO
app.get('/PorMedico', mdAutenticacion.verificaToken, (req, res) => {

    var idMedico = req.query.idMedico;

    Hospitalizacion.find({ usuario: idMedico })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, hospitalizaciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitalizaciones',
                        errors: err
                    });
                }

                Hospitalizacion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        hospitalizaciones: hospitalizaciones,
                        total: total
                    });
                });
            }
        )
});

// OBTENER UNA SOLICITUD
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospitalizacion.findById(id)
        .populate('usuario')
        .populate('atencion')
        .exec((err, hospitalizacion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la hospitalizacion',
                    errors: err
                });
            } if (!hospitalizacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `La hospitalizacion con el id: ${id} no existe`,
                    errors: { message: 'No existe una hospitalizacion con ese ID' }
                });
            }
    
            return res.status(200).json({
                ok: true,
                hospitalizacion: hospitalizacion
            });
    
        });

});

module.exports = app;