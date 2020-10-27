var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const usuario = require('../models/usuario');
const client = new OAuth2Client(CLIENT_ID);

// Middleware
var mdAutenticacion = require('../middlewares/autenticacion');

// Renueva Token
app.get('/renuevaToken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 });

    res.status(200).json({
        ok: true,
        token: token
    });

});


// Autenticacion de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}
// verify().catch(console.error);

app.post('/google', async (req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            res.status(200).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {

            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticacino normal',
                });
            } else {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    menu: obtenerMenu(usuarioDB.role),
                    mensaje: 'Login correcto'
                });

            }

        } else {

            // Usuario no existe hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuario) => {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

                res.status(200).json({
                    ok: true,
                    usuario: usuario,
                    token: token,
                    menu: obtenerMenu(usuarioDB.role),
                    mensaje: 'Login correcto'
                });

            })

        }

    });

});

// Autenticacion normal
app.post('/', (req, res) => {

    var body = req.body;

    Medico.findOne({ correo: body.correo }, (err, medicoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        } else if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Email incorrecto',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, medicoDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Contraseña incorrecta',
                errors: err
            });
        }

        // Crear un token
        medicoDB.password = ':)';
        var token = jwt.sign({ medico: medicoDB }, SEED, { expiresIn: 14400 }); //4 horas

        res.status(200).json({
            ok: true,
            medico: medicoDB,
            token: token,
            mensaje: 'Login correcto'
        });

    });

});

function obtenerMenu(ROLE){

    var menu = [
        {
          titulo: 'Principal',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Dashboard', url: '/dashboard' },
            { titulo: 'ProgressBar', url: '/progress' },
            { titulo: 'Graficas', url: '/graficas1' },
            { titulo: 'Promesas', url: '/promesas' },
            { titulo: 'Rxjs', url: '/rxjs' }
          ]
        },
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            { titulo: 'Hospitales', url: '/hospitales' },
            { titulo: 'Medicos', url: '/medicos' }
          ]
        }
      ];

      if(ROLE === 'ADMIN_ROLE'){
          menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
      }

    return menu;

}

module.exports = app;