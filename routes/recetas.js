var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var Receta = require('../models/recetas');

// CREAR NUEVA SOLICITUD
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var receta = new Receta({
        remedios: body.remedios,
        usuario: body.usuario,
        medico: req.medico._id
    });

    receta.save((err, recetaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear receta',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: recetaGuardada,
            });
        }
    });

});

// OBTENER RECETAS POR PACIENTE
app.get('/PorPaciente', mdAutenticacion.verificaToken, (req, res) => {

    var idPaciente = req.query.idPaciente;

    Receta.find({ usuario: idPaciente })
        .populate('usuario', 'nombre email')
        .populate('medicos', '_id nombre')
        .exec(
            (err, recetas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando recetas',
                        errors: err
                    });
                }

                Receta.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        recetas: recetas,
                        total: total
                    });
                });
            }
        )
});

// OBTENER RECETAS POR PACIENTE
app.get('/PorMedico', mdAutenticacion.verificaToken, (req, res) => {

    var idMedico = req.query.idMedico;

    Receta.find({ usuario: idMedico })
        .populate('usuario', 'nombre email')
        .exec(
            (err, recetas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando recetas',
                        errors: err
                    });
                }

                Receta.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        recetas: recetas,
                        total: total
                    });
                });
            }
        )
});

// OBTENER UNA RECETA
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Receta.findById(id)
        .populate('usuario')
        .populate('medicos', '_id nombre')
        .exec((err, receta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la receta',
                    errors: err
                });
            }
            if (!receta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `La receta con el id: ${id} no existe`,
                    errors: { message: 'No existe una receta con ese ID' }
                });
            }

            return res.status(200).json({
                ok: true,
                receta: receta
            });

        });

});

module.exports = app;