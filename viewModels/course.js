var Course = require('../models/course.js');

var _ = require('underscore');

module.exports = {

	getCourseList : function(courses, tag, type){
		var vm = _.map(courses,function(course){
			return _.pick(course,'name','img','info','_id','learning');
		});
		return {courses:vm, tag:tag, type:type};
	},
	getCoursePreferences : function(course,videos){
		var length = parseInt(videos.length)+1;
		var vm = _.omit(course,'__v');
		return  _.extend(vm, {
			index:length,
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
