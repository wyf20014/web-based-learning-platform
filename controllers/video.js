var Video = require('../models/video.js');
var VideoViewModel = require('../viewModels/video.js');
var Student = require('../models/student.js');
var Course = require('../models/course.js');

module.exports = {
	registerRoutes: function(app) {
		app.get('/video/play/:tag/:course/:name', this.play);
	},

	play: function(req, res, next) {
		if(req.session.role == 'student' ){
			Student.findById(req.session.account.id,function(err, student){
				if(student){
					console.log(student);
					var courses = student.courses;
					var flag = false;
					for(var i=0,length=courses.length;i<length;i++){
						if(courses[i].course_name==req.params.course){
							courses[i].video_name = req.params.name;
							flag=true;
						}
					}
					if(!flag){
						Course.findOne({name:req.params.course},function(err, course){
							console.log(course);
							if(course){
								courses.push( { course_name : req.params.course , video_name : req.params.name, tag: course.tag});
								student.save();
								course.learning +=1;
								course.save();
							}
						});
					}
					else{
						student.save();
					}
				}
			});
		}
		Video.findOne({course_name: req.params.course, name: req.params.name},function(err, video){
			if(err) return next(err);
			if(!video) return next();
			var video_tag = {tag:req.params.tag, video_data: video};
			res.render('video/play',video_tag);
		});		
	},
};
