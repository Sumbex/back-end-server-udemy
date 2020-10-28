var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var Atencion = require('../models/atenciones');

// OBTENER ATENCIONES POR PACIENTE
app.get('/porPaciente/', mdAutenticacion.verificaToken, (req, res) => {

    var idPaciente = req.query.idPaciente;

    Atencion.find({ usuario: idPaciente })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, atenciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando atenciones',
                        errors: err
                    });
                }

                Atencion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        atenciones: atenciones,
                        total: total
                    });
                });
            }
        )
});

// OBTENER ATENCIONES POR MEDICO
app.get('/porMedico/', mdAutenticacion.verificaToken, (req, res) => {

    var idMedico = req.query.idMedico;

    Atencion.find({ medico: idMedico })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, atenciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando atenciones',
                        errors: err
                    });
                }

                Atencion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        atenciones: atenciones,
                        total: total
                    });
                });
            }
        )
});

// Obtener todas las atenciones
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    var desde = req.query.desde || 0;
    var estado = req.query.estado || 1;
    desde = Number(desde);

    Atencion.find({ estado: estado })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, atenciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando atenciones',
                        errors: err
                    });
                }

                Atencion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        atenciones: atenciones,
                        total: total
                    });
                });
            }
        )
});

// CREAR NUEVA ATENCION
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var atencion = new Atencion({
        motivo: body.motivo,
        usuario: body.usuario,
        estado: 1,
        medico: req.medico._id
    });

    atencion.save((err, atencionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear atencion',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: atencionGuardada
            });
        }
    });

});

// OBTENER UNA ATENCION
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Atencion.findById(id)
        .populate('usuario')
        .exec((err, atencion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar atencion',
                    errors: err
                });
            } if (!atencion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `La atencion con el id: ${id} no existe`,
                    errors: { message: 'No existe un medico con ese ID' }
                });
            }

            return res.status(200).json({
                ok: true,
                atencion: atencion
            });

        });

});

// ACTUALIZAR ATENCION
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Atencion.findById(id, (err, atencion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar atencion',
                errors: err
            });
        } if (!atencion) {
            return res.status(400).json({
                ok: false,
                mensaje: `la atencion con el id: ${id} no existe`,
                errors: { message: 'No existe una atencion con ese ID' }
            });
        }

        atencion.motivo = body.motivo;
        atencion.observaciones = body.observaciones;
        atencion.nivelUrgencia = body.nivelUrgencia;
        atencion.procedimientoRealizado = body.procedimientoRealizado;
        atencion.indicaciones = body.indicaciones;
        atencion.diagnostico = body.diagnostico;
        atencion.estado = body.estado;
        atencion.usuario = body.usuario;

        atencion.save((err, atencionGuardada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar atencion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                body: atencionGuardada
            });

        });

    });

});

module.exports = app;