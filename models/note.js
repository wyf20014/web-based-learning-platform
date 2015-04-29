var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
    title: String,
    content: {type : String, default: ''},
    tag: {type : String, default: ''},
    stu_account: String,  
    speech:{type: Number, default:0},
    time: {type : Date, default: Date.now},
});

var Note = mongoose.model('Note', noteSchema);

module.exports = Note;