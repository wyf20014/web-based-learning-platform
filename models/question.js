var mongoose = require('mongoose');
var Answer = require('./answer.js') 

var questionSchema = mongoose.Schema({
    name: String,
    time: {type : Date, default: Date.now},
    content: String,
    tag: String,
    stu_account: String,  
    state:{type:String, default:'unsolved'},
});

questionSchema.methods.getAnswers = function(cb){
    return Answer.find({ question_name: this.name }, cb);
};

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;