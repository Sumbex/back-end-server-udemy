var express = require('express');

var app = express();

var mdAutenticacion = require('../middlewares/autenticacion');

var Evento = require('../models/eventos');

// CREAR NUEVO EVENTO
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var evento = new Evento({
        title: body.title,
        start: body.start,
        end: body.end,
        descripcion: body.descripcion
    });

    evento.save((err, eventoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear evento',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: eventoGuardado,
            });
        }
    });

});

// Obtener todos los eventos
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    Evento.find({})
        .exec(
            (err, evento) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando eventos',
                        errors: err
                    });
                }

                Evento.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        eventos: evento,
                        total: total
                    });
                });
            }
        )
});

module.exports = app;