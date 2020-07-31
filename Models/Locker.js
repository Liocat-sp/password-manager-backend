const mongoose = require('mongoose');
const User = require('./User');

const Schema = mongoose.Schema;

const LockerSchema = new Schema({
    website: {
        type: String,
        required: true
    },
    websiteUrl: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Locker', LockerSchema);
