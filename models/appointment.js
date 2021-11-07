const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    totalCost: {
        type: Number,
        default: 0
    },
    time: {
        type: String,
        required: true
    },
    date:
    {
        type: String,
        required: true
    },
    services: {
        type: [String],
        required: true
    },
    salon: {
        type: String,
        required: true
    }




})

const appointments = mongoose.model('appointments', appointmentSchema);

module.exports = appointments;