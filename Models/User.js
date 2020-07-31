const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const UserSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accounts: [{
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Locker"
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('User', UserSchema);


