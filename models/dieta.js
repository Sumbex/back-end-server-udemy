var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dietaSchema = new Schema({
    contenido: { type: String, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
    {
        timestamps: true,
        collection: 'dietas'
    }
);

module.exports = mongoose.model('Dieta', dietaSchema);