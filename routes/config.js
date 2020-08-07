var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var Configuracion = require('../models/config');

// CREAR NUEVA SOLICITUD
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var configuracion = new Configuracion({
        nombre: body.nombre,
        direccion: body.direccion,
        numero: body.numero
    });

    configuracion.save((err, configuracionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear configuracion',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: configuracionGuardada,
            });
        }
    });

});

// OBTENER CONFIGURACION
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    Configuracion.find()
        .exec(
            (err, configuracion) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando configuracion',
                        errors: err
                    });
                }

                if (configuracion.length > 0) {

                    res.status(200).json({
                        ok: true,
                        configuracion: configuracion[0],
                    });
                }
            }
        )
});

// ACTUALIZAR MEDICO
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Configuracion.findById(id, (err, configuracion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar configuracion',
                errors: err
            });
        } if (!configuracion) {
            return res.status(400).json({
                ok: false,
                mensaje: `La configuracion con el id: ${id} no existe`,
                errors: { message: 'No existe una configuracion con ese ID' }
            });
        }

        configuracion.nombre = body.nombre;
        configuracion.direccion = body.direccion;
        configuracion.numero = body.numero;

        configuracion.save((err, configuracionGuardada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar configuracion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                body: configuracionGuardada
            });

        });

    });

});

module.exports = app;