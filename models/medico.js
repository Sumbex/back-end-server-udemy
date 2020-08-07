var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: {type: String, required:[true, 'El nombre es requerido']},
    img: {type: String, required: false},
    rut: {type: String, required: false},
    fechaNacimiento: {type: String, required: false},
    genero: {type: String, required: false},
    numeroContacto: {type: String, required: false},
    numeroFamiliar: {type: String, required: false},
    correo: {type: String, unique:true, required:[false, 'El email es requerido']},
    password: { type: String, required:[false, 'Debe de ingresar una contraseña'] },
    residencia: {type: String, required: false},
    usuario: {type: Schema.Types.ObjectId, ref:'Usuario', required:false},
    hospital: {type: Schema.Types.ObjectId, ref: 'Hospital', required: [false, 'Debe de ingresar el id del hospital']}
});

module.exports = mongoose.model('Medico', medicoSchema);