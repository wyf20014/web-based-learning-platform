var Question = require('../models/question.js');

var _ = require('underscore');

module.exports = {

	getQuestionList : function(questions, tag){
		var vm = _.map(questions,function(question){
			return question;
		});
		var length = questions.length;
		return {questions:vm, tag:tag, questionLength:length};
	},

	getQuestionPreferences : function(question,answers,req){
		var vm = question;
		var flag= true;
		if(vm.stu_account == req.session.account.name){
			flag = false;
		}
		return  _.extend(vm,{
				answerRight : flag,
			}, {
			answers: answers.map(function(answer){
				return {
					content: answer.content,
					stu_account: answer.stu_account,
					time: answer.time.toString().slice(0,-14),
				};
			}),
		});
	},
};
