var Course = require('../models/course.js');

var _ = require('underscore');

module.exports = {

	getCourseList : function(courses, tag){
		var vm = _.map(courses,function(course){
			return _.pick(course,'name','img','info');
		});
		return {courses:vm,tag:tag};
	},

	getCoursePreferences : function(course,videos){
		var vm = _.omit(course,'_id');
		return  _.extend(vm, {
			videos: videos.map(function(video){
				return {
					videoName: video.name,
					index: video.index,
					url: video.url,
				};
			}),
		});
	},
};
