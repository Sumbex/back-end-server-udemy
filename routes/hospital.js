var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// Obtener todos los hospitales
app.get('/', mdAutenticacion.verificaToken, (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, total) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: total
                    });
                });
            }
        )
});

// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un hospital con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        })
})

// ACTUALIZAR HOSPITAL
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        } if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el id: ${id} no existe`,
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                body: hospitalGuardado
            });

        });

    });

});

// CREAR UN NUEVO HOSPITAL
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        } else {
            res.status(201).json({
                ok: true,
                body: hospitalGuardado,
                usuarioToken: req.usuario
            });
        }
    });
});

// ELIMINAR USUARIO POR ID
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        } else if (!hospitalBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            body: hospitalBorrado
        });

    });

});

module.exports = app;