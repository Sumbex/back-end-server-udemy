var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var ConfigExamen = require('../models/configExamen');

// CREAR NUEVO TIPO EXAMEN
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var tipoExamen = new ConfigExamen({
        descripcion: body.descripcion
    });

    tipoExamen.save((err, tipoExamenGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear tipo de examen',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: tipoExamenGuardado,
            });
        }
    });

});

// OBTENER TODOS LOS TIPOS DE EXAMENES
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    ConfigExamen.find({})
        .exec(
            (err, tipoExamenes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando tipos de examenes',
                        errors: err
                    });
                }

                ConfigExamen.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        tipoExamenes: tipoExamenes,
                        total: total
                    });
                });
            }
        )
});

module.exports = app;