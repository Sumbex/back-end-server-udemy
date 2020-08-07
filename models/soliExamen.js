var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var soliExamenSchema = new Schema({
    tipoExamen: { type: Schema.Types.ObjectId, ref: 'ConfigExamen' },
    fechaExamen: { type: String, required: true },
    datos: { type: String, required: false },
    estadoSolicitud: { type: Number, required: true },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
},
    {
        timestamps: true,
        collection: 'soliExamenes'
    }
);

module.exports = mongoose.model('SoliExamen', soliExamenSchema);