var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventoSchema = new Schema({
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: false },
    descripcion: { type: String, required: true }
},
    {
        timestamps: true,
        collection: 'eventos'
    }
);

module.exports = mongoose.model('Evento', eventoSchema);