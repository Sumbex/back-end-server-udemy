var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// Middleware de opciones
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colecciones validos
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error, la coleccion seleccionada no es valida'
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error, debe de seleccionar una imagen'
        });
    }

    // Obtener el nombre del archivo y su extension
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo aceptar ciertas extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: `Las extensiones validas son: ${extensionesValidas.join(', ')}` }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo temporal al path del servidor
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    switch (tipo) {

        case 'usuarios':

            Usuario.findById(id, (err, usuario) => {

                var pathViejo = './uploads/usuarios/' + usuario.img;

                // elimina si existe una imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {

                        if (err) {
                            return res.status(500).json({
                                ok: true,
                                mensaje: 'Error al borrar imagen antigua',
                            });
                        }

                    });
                }

                usuario.img = nombreArchivo;

                usuario.save((err, usuarioActualizado) => {

                    usuarioActualizado.password = ':)';

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada correctamente',
                        usuario: usuarioActualizado
                    });

                });

            });

            break;

        case 'medicos':

            Medico.findById(id, (err, medico) => {

                var pathViejo = './uploads/medicos/' + medico.img;

                // elimina si existe una imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {

                        if (err) {
                            return res.status(500).json({
                                ok: true,
                                mensaje: 'Error al borrar imagen antigua',
                            });
                        }

                    });
                }

                medico.img = nombreArchivo;

                medico.save((err, medicoActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico actualizada correctamente',
                        medico: medicoActualizado
                    });

                });

            });


            break;

        case 'hospitales':

            Hospital.findById(id, (err, hospital) => {

                var pathViejo = './uploads/hospitales/' + hospital.img;

                // elimina si existe una imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {

                        if (err) {
                            return res.status(500).json({
                                ok: true,
                                mensaje: 'Error al borrar imagen antigua',
                            });
                        }

                    });
                }

                hospital.img = nombreArchivo;

                hospital.save((err, hospitalActualizado) => {

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de hospital actualizada correctamente',
                        hospital: hospitalActualizado
                    });

                });

            });

            break;

        default:

            res.status(400).json({
                ok: false,
                mensaje: 'los tipos de coleccion solo son, hospitales, medicos, usuarios'
            });

            break;
    }

}

module.exports = app;