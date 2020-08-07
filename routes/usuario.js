var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// OBTENER TODOS LOS USUARIOS
app.get('/', mdAutenticacion.verificaToken, (req, res, next) => {

    Usuario.find({})
        .exec(

            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, (err, total) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: total
                    });

                });

            })

});

// OBTENER UN PACIENTE
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findById(id)
        .exec((err, paciente) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar paciente',
                    errors: err
                });
            } if (!paciente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El paciente con el id: ${id} no existe`,
                    errors: { message: 'No existe un paciente con ese ID' }
                });
            }
    
            return res.status(200).json({
                ok: true,
                paciente: paciente
            });
    
        });

});

// ACTUALIZAR USUARIO
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        } if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id: ${id} no existe`,
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.rut = body.rut;
        usuario.fechaNacimiento = body.fechaNacimiento;
        usuario.genero = body.genero;
        usuario.numeroContacto = body.numeroContacto;
        usuario.numeroFamiliar = body.numeroFamiliar;
        usuario.email = body.email;
        usuario.residencia = body.residencia;
        usuario.alergias = body.alergias;
        usuario.enfermedades = body.enfermedades;
        usuario.password = body.password;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                body: usuarioGuardado
            });

        });

    });

});

// CREAR UN NUEVO USUARIO
app.post('/' , mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        rut: body.rut,
        fechaNacimiento: body.fechaNacimiento,
        genero: body.genero,
        numeroContacto: body.numeroContacto,
        numeroFamiliar: body.numeroFamiliar,
        residencia: body.residencia,
        alergias: body.alergias,
        enfermedades: body.enfermedades,
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: usuarioGuardado,
                usuarioToken: req.usuario
            });
        }
    });
});

// ELIMINAR USUARIO POR ID
app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdmin], (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        } else if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            body: usuarioBorrado
        });

    });

});

module.exports = app;