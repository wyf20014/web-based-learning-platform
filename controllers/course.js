var Course = require('../models/course.js');
var courseViewModel = require('../viewModels/course.js');

module.exports = {
	registerRoutes: function(app) {
		app.get('/course/list', this.list);
		app.get('/course/:name/preferences', this.preferences);
	},

	list: function(req, res, next) {
		if(!req.query.tag||req.query.tag=='all') var tag={};
		else{
			var tag = {tag: req.query.tag};
		}
		if(req.query.type!='hotest'){
			Course.find(tag,function(err, courses) {
				if(err) return next(err);
				if(!courses) return next(); 
				var tag_id = req.query.tag||'all';
				var type_id = 'newest';
				res.render('course/list', courseViewModel.getCourseList(courses, tag_id, type_id));
			}).sort({"time":-1}) ;
		}
		else{
			Course.find(tag,function(err, courses){
				if(err) return next(err);
				if(!courses) return next(); 
				var tag_id = req.query.tag||'all';
				var type_id = 'hotest';
				res.render('course/list', courseViewModel.getCourseList(courses,tag_id, type_id));
			}).sort({'learning':-1});
		}
	},

	preferences: function(req, res, next) {
		Course.findOne({name:req.params.name}, function(err, course) {
			if(err) return next(err);
			if(!course) return next(); 	// pass this on to 404 handler
			course.getVideos(function(err, videos) {
				if(err) return next(err);
				res.render('course/preferences', courseViewModel.getCoursePreferences(course, videos));
			});
		});
	},
};
