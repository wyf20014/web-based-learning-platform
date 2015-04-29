var Student = require('../models/student.js');
var Course = require('../models/course.js');

var _ = require('underscore');

module.exports = {

	getMyCourses : function (student){
		var courses = student.courses;
		var courses_img = [ ];
		courses.map(function(course){
			var data = { };
			data.video = course.video_name;
			data.course = course.course_name;
			Course.findOne({name:course.course_name},function(err,course_info){
				if(err||!course_info){return false;}
				else{
					data.img = course_info.img;
					courses_img.push(data);
				} 
			});
		});
		return {courses_list:courses_img};
	},

	getMyNotes : function (student, notes){
		var vm = _.pick(student, 'name');
		return _.extend(vm,{
			notes: notes.map(function(note){
				return {
					title: note.title,
					date: note.date,
					content: note.content,
					id: note._id,
					tag:note.tag,
				};
			}),
		});
	},
};

