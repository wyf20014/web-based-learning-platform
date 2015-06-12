var Student = require('../models/student.js');
var Course = require('../models/course.js');

var _ = require('underscore');

module.exports = {

	getMyCourses : function (student){
		var courses = student.courses;
		var courseWithImg = [ ];
		courses.map(function(course){
			var data = { };
			data.video = course.video_name;
			data.course = course.course_name;
			Course.findOne({name:course.course_name},function(err,course_info){
				if(err||!course_info){return false;}
				else{
					data.img = course_info.img;
					courseWithImg.push(data);
				} 
			});
		});
		var courseLength = { courseLength:courses.length};
		return _.extend(courseLength,{courses_list:courseWithImg});
	},

	getRecommendCourses : function (student){
		var stu_courses = student.courses;
		var  stu_courses_length= stu_courses.length;
		var coursesName = [], coursesTag=[];
		for(var i=0; i<stu_courses_length; i++){
			coursesName[i] = stu_courses[i].course_name;
			if( coursesTag.indexOf( stu_courses[i].tag ) == -1 )
				coursesTag.push( stu_courses[i].tag);
		}
		var  interest = [];
		for(var i=0, length=coursesTag.length; i<length; i++){
			var n=0;
			Course.find({tag:coursesTag[i]},function(err,courses){
				if(courses){
					for(var k=0, courseslength=courses.length; k<courseslength; k++ ){
						if( coursesName.indexOf( courses[k].name ) == -1){
							interest[n]=courses[k];
							n++;
						}
					}
				}
			}).limit(5).sort({"learning":-1});
		}
		var fit = [];
		Course.find({grade:student.grade},function(err,courses){
			if(courses){
				var n=0;
				for(var i=0, length=courses.length; i<length; i++ ){
					if(coursesName.indexOf(courses[i].name) == -1){
						fit[n]=courses[i];
						n++;
					}
				}
			}
		}).limit(5).sort({"learning":-1})
		return _.extend({ interest_courses : interest}, { fit_courses : fit} );
	},

	getMyNotes : function (student, notes){
		var vm = _.pick(student, 'name');
		var length = notes.length;
		return _.extend(vm,{
			notes: notes.map(function(note){
				return {
					title: note.title,
					date: note.date,
					content: note.content,
					id: note._id,
					tag : note.tag,
					time :note.time.toString().slice(0,-14)
				}
			})
		},{"noteLength":length});
	},

	getMyAccount : function (student){
		var course_number = student.courses.length;
		var vm = _.omit(student,'_id',"account");
		return _.extend(vm,{course_number:course_number});
	},

	getMyQuestions : function (questions){
		var questionsLength = questions.length;
		var length = {
			questionLength:questionsLength,
		}
		return _.extend(length,{
				questions: questions.map(function(question){
					return{
						name: question.name,
						content: question.content,
						state: question.state,
						id: question._id,
					};
				}),
		});
	},

	getMyAnswers : function (answers){
		var answersLength = answers.length;
		var length = {
			answerLength:answersLength,
		}
		return _.extend(length,{
				answers: answers.map(function(answer){
					return{
						question_name: answer.question_name,
						question_id: answer.question_id,
						content: answer.content,
						time: answer.time,
					};
				}),
		});
	},


	getMySuggestions : function (suggestions){
		var suggestionsLength = suggestions.length;
		var length = {
			suggestionLength:suggestionsLength,
		}
		return _.extend(length,{
				suggestions: suggestions.map(function(suggestion){
					return{
						title: suggestion.title,
						content: suggestion.content,
						time: suggestion.time.toString().slice(0,-14),
						reply: suggestion.reply,
					};
				}),
		});
	},

	getStudentList : function(students){
		var vm = _.map(students,function(student){
			return student;
		});
		var length = students.length;
		return {students:vm, studentLength:length};
	},

	getStudentAccount : function (student){
		var course_number = student.courses.length;
		var vm = _.omit(student,'_id',"account");
		return _.extend(vm,{course_number:course_number, user_account:student.account});
	},
};

