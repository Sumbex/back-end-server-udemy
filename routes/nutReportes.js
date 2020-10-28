var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var NutReporte = require('../models/nutReportes');

// CREAR NUEVO REPORTE
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var reporte = new NutReporte({
        contenido: body.contenido,
        peso: body.peso,
        altura: body.altura,
        usuario: body.usuario,
        medico: req.medico._id
    });

    reporte.save((err, reporteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear reporte',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: reporteGuardado,
            });
        }
    });

});

// OBTENER REPORTES POR PACIENTE
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    var idPaciente = req.query.idPaciente;

    NutReporte.find({ usuario: idPaciente })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, reportes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando reportes',
                        errors: err
                    });
                }

                NutReporte.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        reportes: reportes,
                        total: total
                    });
                });
            }
        )
});

// OBTENER REPORTES POR MEDICO
app.get('/PorMedico/', mdAutenticacion.verificaToken, (req, res) => {

    var idMedico = req.query.idMedico;

    NutReporte.find({ medico: idMedico })
        .populate('usuario', 'nombre email')
        .populate('medico', '_id nombre')
        .exec(
            (err, reportes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando reportes de nutricion',
                        errors: err
                    });
                }

                NutReporte.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        reportes: reportes,
                        total: total
                    });
                });
            }
        )
});


// OBTENER UN REPORTE
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    NutReporte.findById(id)
        .populate('usuario')
        .exec((err, reporte) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reporte',
                    errors: err
                });
            } if (!reporte) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El reporte con el id: ${id} no existe`,
                    errors: { message: 'No existe un reporte con ese ID' }
                });
            }
    
            return res.status(200).json({
                ok: true,
                reporte: reporte
            });
    
        });

});

module.exports = app;