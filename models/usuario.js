var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({

    nombre: { type: String, required:[true, 'El nombre es requerido'] },
    rut: { type: String, required: false },
    fechaNacimiento: { type: String, required: false },
    genero: { type: String, required: false },
    numeroContacto: { type: String, required: false },
    numeroFamiliar: { type: String, required: false },
    email: { type: String, unique:true, required:[true, 'El email es requerido'] },
    residencia: { type: String, required: false },
    alergias: { type: String, required: false },
    enfermedades: { type: String, required: false },
    password: { type: String, required:[false, 'Debe de ingresar una contraseña'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google: { type: Boolean, default: false }

});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya se encuentra ocupado'})

module.exports = mongoose.model('Usuario', usuarioSchema);