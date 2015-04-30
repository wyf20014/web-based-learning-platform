var Admin = require('../models/admin.js');
var Student = require('../models/student.js');
var Course = require('../models/course.js');
var Note = require('../models/note.js');
var Question = require('../models/question.js');
var Answer = require('../models/answer.js');
var Video= require('../models/video.js');

var adminViewModel = require('../viewModels/admin.js');
var studentViewModel = require('../viewModels/student.js');
var courseViewModel = require('../viewModels/course.js');
var noteViewModel = require('../viewModels/note.js');
var questionViewModel = require('../viewModels/question.js');

module.exports = {

	registerRoutes: function(app) {
		app.get('/admin/login', this.login);
		app.post('/admin/login', this.processLogin);

		app.get('/admin/:id/admin_home', this.home);

		app.get('/admin/:id/course_list', this.courseList);
		app.get('/admin/:id/course_upload', this.courseUpload);
		app.get('/admin/:id/course_del/:name', this.courseDel);

		app.get('/admin/:id/student_list', this.studentList);
		app.get('/admin/:id/student_update/:account', this.studentUpdate);
		app.post('/admin/:id/student_update/:account', this.processStudentUpdate);

		app.get('/admin/:id/question_list', this.questionList);
		app.get('/admin/:id/question_del/:name', this.questionDel);

		app.get('/admin/:id/note_list', this.noteList);
		app.get('/admin/:id/note_del/:student/:title', this.noteDel);
		
	},

	login: function(req, res, next) {
		res.locals.login = {
			url:"/admin/login",
			role : "管理员"
		}
		res.render('public/login');
	},

	processLogin: function(req, res, next) {
		Admin.findOne({name: req.body.account, password:req.body.password},function(err, admin){
			if(err) return next(err);
			if(!admin) {
				req.session.flash = {
					type:'danger', intro:'',
					message:'管理员名或密码错误!',
				}
			return res.redirect(303, '/admin/login');
			}
			else{
				req.session.role="admin";
				req.session.account = {'id':admin._id,'name':admin.name} ;
				req.session.flash = {
					type:'success', intro:'',
					message:'登录成功！欢迎来到管理主页',
				}
				res.redirect(303, '/admin/' + admin._id+'/admin_home');
			}
		});
	},

	home: function(req, res, next) {
		if(req.session.role != 'admin') return next();
		if(req.session.account.id != req.params.id) return next();
		res.render('admin/home');
	},

	courseList: function(req, res, next) {
		if(req.session.role != 'admin') return next();
		if(req.session.account.id != req.params.id) return next();
		Course.find(function(err, courses) {
			if(err) return next(err);
			res.render('admin/course_list', courseViewModel.getCourseList(courses,''));
		});
	},

	courseUpload: function(req, res, next) {
		if(req.session.role != 'admin') return next();
		if(req.session.account.id != req.params.id) return next();
		res.render('admin/course_upload');
	},

	courseDel: function(req, res, next){
		if(req.session.role != 'admin')  return next();
		if(req.session.account.id != req.params.id) return next();
		Course.remove({name :req.params.name }, function(error){
		    if(error) {
		        req.session.flash = {
				type: 'danger',intro: '',
				message: '删除失败，数据库发生了问题，请重试！',
			};
			return res.redirect(303, '/admin/'+req.session.account.id+'/course_list');
		    } else {
		    	Video.remove({course_name : req.params.name }, function(error){
		   		 if(error) {
		   		 	req.session.flash = {
						type:'success', intro:'',
						message:'删除 '+req.params.name +' 成功！',
					}
					return res.redirect(303, '/admin/'+req.session.account.id+'/course_list');
				    } else {
				       	req.session.flash = {
						type:'success', intro:'',
						message:'删除 '+req.params.name +' 成功！',
					}
					res.redirect(303, '/admin/' + req.session.account.id +'/course_list');
		 		   }
			});
		    }
		});
	},

	questionList: function(req, res, next) {
		if(req.session.role != 'admin') return next();
		if(req.session.account.id != req.params.id) return next();
		Question.find(function(err, questions) {
			if(err) return next(err);
			res.render('admin/question_list', questionViewModel.getQuestionList(questions,''));
		});
	},

	questionDel: function(req, res, next){
		if(req.session.role != 'admin')  return next();
		if(req.session.account.id != req.params.id) return next();
		Question.remove({name :req.params.name }, function(error){
		    if(error) {
		        req.session.flash = {
				type: 'danger',intro: '',
				message: '删除失败，数据库发生了问题，请重试！',
			};
			return res.redirect(303, '/admin/'+req.session.account.id+'/question_list');
		    } else {
		    	Answer.remove({question_name : req.params.name }, function(error){
		   		 if(error) {
		   		 	req.session.flash = {
						type:'success', intro:'',
						message:'关于 '+req.params.name +' 的问题删除成功！',
					}
					return res.redirect(303, '/admin/'+req.session.account.id+'/question_list');
				    } else {
				       	req.session.flash = {
						type:'success', intro:'',
						message:'关于 '+req.params.name +' 的问题删除成功！',
					}
					res.redirect(303, '/admin/' + req.session.account.id +'/question_list');
		 		   }
			});
		    }
		});
	},

	noteList: function(req, res, next) {
		if(req.session.role != 'admin') return next();
		if(req.session.account.id != req.params.id) return next();
		Note.find(function(err, notes) {
			if(err) return next(err);
			res.render('admin/note_list', noteViewModel.getNoteList(notes,''));
		});
	},

	noteDel: function(req, res, next){
		if(req.session.role != 'admin')  return next();
		if(req.session.account.id != req.params.id) return next();
		Note.remove({stu_account: req.params.student, title:req.params.title}, function(error){
		    if(error) {
		        req.session.flash = {
				type: 'danger',intro: '',
				message: '删除失败，数据库发生了问题，请重试！',
			};
			return res.redirect(303, '/admin/'+req.session.account.id+'/note_list');
		    } else {
		       	req.session.flash = {
				type:'success', intro:'',
				message:req.params.student+'的'+req.params.title+'删除成功！',
			}
			res.redirect(303, '/admin/' + req.session.account.id +'/note_list');
		    }
		});
	},

	studentList: function(req, res, next) {
		if(req.session.role != 'admin') return next();
		if(req.session.account.id != req.params.id) return next();
		Student.find(function(err, students) {
			if(err) return next(err);
			res.render('admin/student_list', studentViewModel.getStudentList(students));
		});
	},

	studentUpdate: function(req, res, next) {
		if(req.session.role != 'admin') return next();
		if(req.session.account.id != req.params.id) return next();
		Student.findOne({account:req.params.account},function(err, student){
			if(err) return next(err);
			if(!student) {
				req.session.flash = {
					type:'danger', intro:'',
					message:'无此用户!',
				}
				return res.redirect(303, '/admin/'+req.session.account.id+'/student_list');
			}
			else{
				res.render('admin/student_update',studentViewModel.getStudentAccount(student));
			}
		})
	},

	processStudentUpdate: function(req, res, next) {
		if(req.session.role != 'admin')  return next();
		if(req.session.account.id != req.params.id) return next();
		var conditions = {account: req.body.account};
		var update     = {$set : {name : req.body.name, exp : req.body.exp}};
		var options    = {upsert : true};
		Student.update(conditions, update, options, function(error){
    			if(error) {
      				  req.session.flash = {
					type: 'danger',intro: '',
					message: '修改失败，数据库发生了问题，请重试！',
				};
				return res.redirect(303, '/admin/'+req.session.account.id+'/student/'+req.body.account);
   			 } else {
      			  	req.session.flash = {
					type:'success', intro:'',
					message:'学生信息修改成功！',
				}
				res.redirect(303, '/admin/' + req.session.account.id +'/student_list');
   			 }
		});
				
	},

};
