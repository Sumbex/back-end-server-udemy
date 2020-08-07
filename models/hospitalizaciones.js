var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospitalizacionesSchema = new Schema({
    motivo: { type: String, required: true },
    atencion: { type: Schema.Types.ObjectId, ref: 'Atencion' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
    {
        timestamps: true,
        collection: 'hospitalizaciones'
    }
);

module.exports = mongoose.model('Hospitalizacion', hospitalizacionesSchema);