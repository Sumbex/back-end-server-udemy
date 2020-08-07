var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var nutReporteSchema = new Schema({
    contenido: { type: String, required: true },
    peso: { type: Number, required: true },
    altura: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
    {
        timestamps: true,
        collection: 'nutReportes'
    }
);

module.exports = mongoose.model('nutReporte', nutReporteSchema);