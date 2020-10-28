var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var atencionSchema = new Schema({
    motivo: { type: String, required: true },
    observaciones: { type: String, required: false },
    nivelUrgencia: { type: Number, required: false },
    procedimientoRealizado: { type: String, required: false },
    indicaciones: { type: String, required: false },
    diagnostico: { type: String, required: false },
    estado: { type: Number, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    medico: { type: Schema.Types.ObjectId, ref: 'Medico' }
},
    {
        timestamps: true,
        collection: 'atenciones'
    }
);

module.exports = mongoose.model('Atencion', atencionSchema);