var mongoose = require('mongoose');
var Note = require('./note.js');
var Question = require('./question.js');
var Answer = require('./answer.js');

var studentSchema = mongoose.Schema({
    account: String,
    name: String,
    password: String,
    grade:{type:String,default:''},
    exp: { type: Number, default: 0},
    note_number:{type:Number,default:0},
    question_number:{type:Number,default:0},
    answer_number:{type:Number,default:0},
    courses:[{
            course_name: String, 
            video_name: String ,  //course_name, video_index
            tag:String ,
    }], 
});
studentSchema.methods.getNotes = function(cb){
    return Note.find({ stu_account: this.account }, cb);
};
studentSchema.methods.getAnswers = function(cb){
    return Answer.find({ stu_account: this.account }, cb);
};
studentSchema.methods.getQuestions = function(cb){
    return Question.find({ stu_account: this.account }, cb);
};

var Student = mongoose.model('Student', studentSchema);


module.exports = Student;