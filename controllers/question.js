var Question = require('../models/question.js');
var questionViewModel = require('../viewModels/question.js');

module.exports = {
	registerRoutes: function(app) {
		app.get('/question/list', this.list);
		app.get('/question/:id/preferences', this.preferences);
	},

	list: function(req, res, next) {
		if(!req.query.tag) var tag={};
		else{
			var tag = {tag: req.query.tag};
		}
		Question.find(tag,function(err, questions) {
			if(err) return next(err);
			if(!questions) return next(); 
			var tag_id = req.query.tag||'all';
			res.render('question/list', questionViewModel.getQuestionList(questions,tag_id));
		});
	},

	preferences: function(req, res, next) {
		Question.findById(req.params.id, function(err, question) {
			if(err) return next(err);
			if(!question) return next(); 	// pass this on to 404 handler
			question.getAnswers(function(err, answers) {
				if(err) return next(err);
				req.session.question = {'name':question.name,'id':question._id};
				res.render('question/preferences', questionViewModel.getQuestionPreferences(question, answers));
			});
		});
	},

};
