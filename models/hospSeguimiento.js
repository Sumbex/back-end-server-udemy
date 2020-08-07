var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospSeguimientoSchema = new Schema({
    estado: { type: String, required: true },
    img: { type: String, required: false },
    hospitalizacion: { type: Schema.Types.ObjectId, ref: 'Hospitalizacion' }
},
    {
        timestamps: true,
        collection: 'hospSeguimientos'
    }
);

module.exports = mongoose.model('HospSeguimiento', hospSeguimientoSchema);