var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = new Schema({
    nombre: { type: String, required: true },
    indicaciones: { type: String, required: true }
});

var recetaSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    remedios: [itemSchema]
},
    {
        timestamps: true,
        collection: 'recetas'
    }
);

module.exports = mongoose.model('Receta', recetaSchema);