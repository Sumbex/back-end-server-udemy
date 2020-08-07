var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var configSchema = new Schema({
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    numero: { type: String, required: true },
    img: { type: String, required: false }
},
    {
        timestamps: true,
        collection: 'configuraciones'
    }
);

module.exports = mongoose.model('Configuracion', configSchema);