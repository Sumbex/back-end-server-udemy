var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// Obtener todos los medicos
app.get('/', mdAutenticacion.verificaToken, (req, res, next) => {

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: total
                    });
                });
            }
        )
});

// OBTENER UN MEDICO
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findById(id)
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            } if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El medico con el id: ${id} no existe`,
                    errors: { message: 'No existe un medico con ese ID' }
                });
            }
    
            return res.status(200).json({
                ok: true,
                medico: medico
            });
    
        });

});

// ACTUALIZAR MEDICO
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        } if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id: ${id} no existe`,
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.rut = body.rut;
        medico.fechaNacimiento = body.fechaNacimiento;
        medico.genero = body.genero;
        medico.numeroContacto = body.numeroContacto;
        medico.numeroFamiliar = body.numeroFamiliar;
        medico.correo = body.correo;
        medico.residencia = body.residencia;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                body: medicoGuardado
            });

        });

    });

});

// CREAR UN NUEVO MEDICO
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        rut: body.rut,
        fechaNacimiento: body.fechaNacimiento,
        genero: body.genero,
        numeroContacto: body.numeroContacto,
        numeroFamiliar: body.numeroFamiliar,
        correo: body.correo,
        residencia: body.residencia
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: medicoGuardado,
                usuarioToken: req.usuario
            });
        }
    });
});

// ELIMINAR USUARIO POR ID
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        } else if (!medicoBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un medico con ese ID',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            body: medicoBorrado
        });

    });

});

module.exports = app;