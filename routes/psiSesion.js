var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var PsiSesion = require('../models/psiSesion');

// CREAR NUEVA SESIÓN
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var sesion = new PsiSesion({
        contenido: body.contenido,
        usuario: body.usuario,
        medico: req.medico._id
    });

    sesion.save((err, sesionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear sesion',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: sesionGuardada,
            });
        }
    });

});

// OBTENER SESIONES POR PACIENTE
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    var idPaciente = req.query.idPaciente;

    PsiSesion.find({ usuario: idPaciente })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, sesiones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando sesiones',
                        errors: err
                    });
                }

                PsiSesion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        sesiones: sesiones,
                        total: total
                    });
                });
            }
        )
});

// OBTENER SESIONES POR MEDICO
app.get('/PorMedico/', mdAutenticacion.verificaToken, (req, res) => {

    var idMedico = req.query.idMedico;

    PsiSesion.find({ medico: idMedico })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, sesiones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando sesiones',
                        errors: err
                    });
                }

                PsiSesion.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        sesiones: sesiones,
                        total: total
                    });
                });
            }
        )
});

// OBTENER UNA SESION
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    PsiSesion.findById(id)
        .populate('usuario')
        .exec((err, sesion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar sesion',
                    errors: err
                });
            } if (!sesion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `La sesion con el id: ${id} no existe`,
                    errors: { message: 'No existe una sesion con ese ID' }
                });
            }
    
            return res.status(200).json({
                ok: true,
                sesion: sesion
            });
    
        });

});

module.exports = app;