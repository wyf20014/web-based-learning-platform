var Question = require('../models/question.js');

var _ = require('underscore');

module.exports = {

	getQuestionList : function(questions, tag){
		var vm = _.map(questions,function(question){
			return question;
		});
		return {questions:vm,tag:tag};
	},

	getQuestionPreferences : function(question,answers){
		var vm = question;
		return  _.extend(vm, {
			answers: answers.map(function(answer){
				return {
					content: answer.content,
					stu_account: answer.stu_account,
					time: answer.time,
				};
			}),
		});
	},
};
