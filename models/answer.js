var mongoose = require('mongoose');

var answerSchema = mongoose.Schema({
    content: String,
    time: {type : Date, default: Date.now},
    stu_account: String,    
    question_name: String,   
});

var Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;