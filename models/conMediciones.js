var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var conMedicionesSchema = new Schema({
    estatura: { type: Number, required: false },
    peso: { type: Number, required: false },
    temperatura: { type: Number, required: false },
    presion: { type: Number, required: false },
    frecuenciaCardiaca: { type: Number, required: false },
    frecuenciaRespiratoria: { type: Number, required: false },
    atencion: { type: Schema.Types.ObjectId, ref: 'Atencion' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
    {
        timestamps: true,
        collection: 'conMediciones'
    }
);

module.exports = mongoose.model('ConMedicion', conMedicionesSchema);