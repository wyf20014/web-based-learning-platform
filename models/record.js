var mongoose = require('mongoose');

var recordSchema = mongoose.Schema({
    tag: {type: String, default:""},
    time: {type:Date, default:Date.now},
    course_name: {type: String, default:""},
});

var Record = mongoose.model('Record', recordSchema);

module.exports = Record;