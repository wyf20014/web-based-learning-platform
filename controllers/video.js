var Video = require('../models/video.js');
var VideoViewModel = require('../viewModels/video.js');
var Student = require('../models/student.js');
var Course = require('../models/course.js');
var Record= require('../models/record.js');

module.exports = {
	registerRoutes: function(app) {
		app.get('/video/play/:tag/:course/:name', this.play);
	},

	play: function(req, res, next) {
		Course.findOne({name:req.params.course},function(err, course){
			if(course){
				course.learning +=1;
				course.save();
			}
		});
		var c = new Record({
			tag: req.params.tag,
			course_name: req.params.course
		})
		c.save();
		Video.findOne({course_name: req.params.course, name: req.params.name},function(err, video){
			if(err) return next(err);
			if(!video) return next();

			if(req.session.role == 'student' ){
				Student.findById(req.session.account.id,function(err, student){
					if(student){
						var courses = student.courses;
						var existFlag = false;
						for(var i=0,length=courses.length;i<length;i++){
							if(courses[i].course_name==req.params.course){
								existFlag=true;
								if(courses[i].video_index<video.index){
									courses[i].video_name = req.params.name;
									courses[i].video_index = video.index;
									student.exp +=2;
									student.save();
								}
							}
						}
						if(!existFlag){
							courses.push( { course_name : req.params.course , video_name : req.params.name, video_index : video.index, tag: req.params.tag});
							student.exp += 2;
							student.save();
						}
					}
				});
			}		
			var video_tag = {tag:req.params.tag, video_data: video};
			res.render('video/play',video_tag);
		});

		
				
	},
};
