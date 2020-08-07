var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var psiSesionSchema = new Schema({
    contenido: { type: String, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
    {
        timestamps: true,
        collection: 'psiSesiones'
    }
);

module.exports = mongoose.model('psiSesion', psiSesionSchema);