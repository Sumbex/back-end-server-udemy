var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var Dieta = require('../models/dieta');

// CREAR NUEVA DIETA
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var dieta = new Dieta({
        contenido: body.contenido,
        usuario: body.usuario,
        medico: req.medico._id
    });

    dieta.save((err, dietaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear dieta',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: dietaGuardada,
            });
        }
    });

});


// OBTENER DIETAS POR PACIENTE
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    var desde = req.query.desde || 0;
    var idPaciente = req.query.idPaciente;
    desde = Number(desde);

    Dieta.find({ usuario: idPaciente })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, dietas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando dietas',
                        errors: err
                    });
                }

                Dieta.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        dietas: dietas,
                        total: total
                    });
                });
            }
        )
});

// OBTENER DIETA POR MEDICO
app.get('/PorMedico/', mdAutenticacion.verificaToken, (req, res) => {

    var idMedico = req.query.idMedico;

    Dieta.find({ medico: idMedico })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, dietas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando dietas',
                        errors: err
                    });
                }

                Dieta.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        dietas: dietas,
                        total: total
                    });
                });
            }
        )
});

// OBTENER UNA DIETA
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Dieta.findById(id)
        .populate('usuario')
        .exec((err, dieta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar dieta',
                    errors: err
                });
            } if (!dieta) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `La dieta con el id: ${id} no existe`,
                    errors: { message: 'No existe una dieta con ese ID' }
                });
            }
    
            return res.status(200).json({
                ok: true,
                dieta: dieta
            });
    
        });

});

module.exports = app;