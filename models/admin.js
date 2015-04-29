var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    name: String,
    password: String,
});

var Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;