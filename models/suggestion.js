var mongoose = require('mongoose');

var suggestionSchema = mongoose.Schema({
    title: String,
    content: {type : String, default: ''},
    stu_account: String,  
    time: {type : Date, default: Date.now},
    reply:{type:String, default:'暂无回复'},
});

var Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;