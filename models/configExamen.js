var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var configExamenSchema = new Schema({
    descripcion: { type: String, required: true }
},
    {
        timestamps: true,
        collection: 'configExamen'
    }
);

module.exports = mongoose.model('ConfigExamen', configExamenSchema);