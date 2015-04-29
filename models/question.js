var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
    name: String,
    time: {type : Date, default: Date.now},
    content: String,
    tag: String,
    stu_account: String,  
    answers_id:[ String ], 
});
var Question = mongoose.model('Question', questionSchema);

module.exports = Question;