var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// VERIFICAR TOKEN ******************

exports.verificaToken = function (req, res, next) {

    var token = req.query.token;


    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'No cuenta con permisos para realizar esta accion',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        req.medico = decoded.medico;

        next();

    });

}

// VERIFICAR ADMIN ******************

exports.verificaAdmin = function (req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'No cuenta con permisos para realizar esta accion',
        });
    }

}

// VERIFICAR ADMIN O MISMO USUARIO ******************

exports.verificaAdMu = function (req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'No cuenta con permisos para realizar esta accion',
        });
    }

}