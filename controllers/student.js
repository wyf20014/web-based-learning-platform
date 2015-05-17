var Student = require('../models/student.js');
var Note = require('../models/note.js');
var Question = require('../models/question.js');
var Answer = require('../models/answer.js');
var studentViewModel = require('../viewModels/student.js');

function checkStudentAccount(req, res){
	if(!(req.session.role == 'student' && req.session.account.id == req.params.id))
		return res.redirect(303, '/quit_error');
}

module.exports = {

	registerRoutes: function(app) {
		app.get('/student/register', this.register);
		app.post('/student/register', this.processRegister);

		app.get('/student/login', this.login);
		app.post('/student/login', this.processLogin);

		app.get('/student/:id/my_home', this.myHome);

		//课程相关
		app.get('/student/:id/my_course', this.myCourse);
		app.get('/student/:id/course_del/:course',this.stuCourseDel);
		
		//问答相关
		app.get('/student/:id/my_question', this.myQuestion);
		app.get('/student/:id/write_question', this.writeQuestion);
		app.post('/student/:id/write_question', this.processWriteQuestion);
		app.post('/student/:id/write_answer', this.processWriteAnswer);

		//日记相关
		app.get('/student/:id/my_note', this.myNote);
		app.get('/student/:id/write_note', this.writeNote);
		app.post('/student/:id/write_note', this.processWriteNote);
		app.get('/student/:id/update_note/:title', this.updateNote);
		app.post('/student/:id/update_note/:title', this.processUpdateNote);
		app.get('/student/:id/del_note/:title', this.delNote);

		//账户相关
		app.get('/student/:id/my_account', this.myAccount);
		app.get('/student/:id/update_password', this.updatePassword);
		app.post('/student/:id/update_password', this.processUpdatePassword);

		
	},

	register: function(req, res, next) {
		if(req.session.role){
			req.session.flash = {
				type:'danger', intro:'',
				message:'你已登录！返回首页',
			}
			return res.redirect(303, '/');
		}
		res.render('student/register');
	},

	processRegister: function(req, res, next) {
		// TODO: back-end validation (safety)
		if(req.body.password1!==req.body.password2) {
			req.session.flash = {
				type:'danger', intro:'',
				message:'两次密码输入不一致!',
			}
			return res.redirect(303, '/student/register');
		}
		else{
			Student.findOne({account: req.body.account},function(err, student){
				if(err) return next(err);
				if(student) {
					req.session.flash = {
						type:'danger', intro:'',
						message:'用户名已存在!',
					}
					return res.redirect(303, '/student/register');
				}
				var c = new Student({
					account: req.body.account,
					name: req.body.name,
					password: req.body.password1,
				});
				c.save(function(err) {
					if(err) {
						if(req.xhr) return res.json({ error: '注册失败.' });
						req.session.flash = {
							type: 'danger',
							intro: '',
							message: '数据库发生了问题，请重试一次',
						};
						return res.redirect(303, '/student/register');
					}
					if(req.xhr) return res.json({ success: true });
					req.session.role='student';
					req.session.account = {'id':c._id,'name':c.account} ;
					req.session.flash = {
						type:'success', intro:'注册成功！',
						message:'欢迎来到个人主页',
					}
					res.redirect(303, '/student/' + c._id+'/my_home');
				});
			});
		}
	},

	login: function(req, res, next) {
		if(req.session.role){
			req.session.flash = {
				type:'danger', intro:'',
				message:'你已登录！返回首页',
			}
			return res.redirect(303, '/');
		}
		res.locals.login = {
			url:"/student/login",
			role : "用户"
		}
		res.render('public/login');
	},

	processLogin: function(req, res, next) {
		Student.findOne({account: req.body.account, password:req.body.password},function(err, student){
			if(err) return next(err);
			if(!student){
				req.session.flash = {
					type:'danger', intro:'',
					message:'用户名或密码错误!',
				}
			return res.redirect(303, '/student/login');
			}
			else{
				req.session.role='student';
				req.session.account = {'id':student._id,'name':student.account} ;
				req.session.flash = {
					type:'success', intro:'',
					message:'登录成功！欢迎来到个人主页',
				}
				res.redirect(303, '/student/' + student._id+'/my_home');
			}
		});
	},

	myHome: function(req, res, next) {
		checkStudentAccount(req, res);
		res.render('student/my_home');
	},

	myCourse: function(req, res, next) {
		checkStudentAccount(req, res);
		Student.findById(req.params.id, function(err, student) {
			if(err) return next(err);
			if(!student) return next(); 	// pass this on to 404 handler
			res.render('student/my_course', studentViewModel.getMyCourses(student));
		});
	},
	stuCourseDel:function(req, res, next){
		checkStudentAccount(req, res);
		Student.findById(req.params.id, function(err, student) {
			if(err) return next(err);
			if(!student) return next(); 	// pass this on to 404 handler
			var courses = student.courses;
			for(var i=0,length=courses.length;i<length;i++){
				if(courses[i].course_name==req.params.course){
					courses.splice(i,1);
				}
			}
			student.save();
			req.session.flash = {
				type:'success', intro:'',
				message:'退选 '+req.params.course+' 成功！',
			}
			res.render('student/my_course', studentViewModel.getMyCourses(student));
		});
	},
	myNote: function(req, res, next) {
		checkStudentAccount(req, res);
		Student.findById(req.params.id, function(err, student) {
			if(err) return next(err);
			if(!student) return next(); 	// pass this on to 404 handler
			student.getNotes(function(err, notes) {
				if(err) return next(err);
				res.render('student/my_note', studentViewModel.getMyNotes(student, notes));
			});
		});
	},

	writeNote: function(req, res, next) {
		checkStudentAccount(req, res);
		if(!req.session.noteform) req.session.noteform = {'title':'','tag':'','content':''};
		res.locals.noteform = req.session.noteform;
		res.render('student/write_note');
	},

	processWriteNote: function(req, res, next) {
		req.session.noteform = { 
			'title':req.body.title, 
			'tag':req.body.tag,
			'content':req.body.content,
			'stu_account':req.session.account.name,
		};
		Note.findOne({stu_account: req.session.account.name, title:req.body.title},function(err, note){
			if(err) return next(err);
			if(note) {
				req.session.flash = {
					type:'danger', intro:'',
					message:'你已经有一篇同标题的日记了!',
				}
				return res.redirect(303, '/student/'+req.session.account.id+'/write_note');
			}
			else{
				var c = new Note(req.session.noteform);
				c.save(function(err) {
					if(err) {
						if(req.xhr) return res.json({ error: '添加失败.' });
						req.session.flash = {
							type: 'danger',intro: '',
							message: '数据库发生了问题，请重试一次',
						};
						return res.redirect(303, '/student/'+req.session.account.id+'/write_note');
					}
					if(req.xhr) return res.json({ success: true });
					req.session.flash = {
						type:'success', intro:'',
						message:'日记添加成功！',
					}
					delete req.session.noteform;
					res.redirect(303, '/student/' + req.session.account.id +'/my_note');
				});
				
			}
		});
	},

	updateNote: function(req, res, next){
		checkStudentAccount(req, res);
		Note.findOne({stu_account: req.session.account.name, title:req.params.title},function(err,note){
			res.render('student/update_note',note);
		});
	},

	processUpdateNote: function(req, res, next) {
		var conditions = {stu_account: req.session.account.name, title:req.params.title};
		var update     = {$set : {tag : req.body.tag, content : req.body.content}};
		var options    = {upsert : true};
		Note.update(conditions, update, options, function(error){
    			if(error) {
      				  req.session.flash = {
					type: 'danger',intro: '',
					message: '修改失败，数据库发生了问题，请重试！',
				};
				return res.redirect(303, '/student/'+req.session.account.id+'/update_note/'+req.params.title);
   			 } else {
      			  	req.session.flash = {
					type:'success', intro:'',
					message:'日记修改成功！',
				}
				res.redirect(303, '/student/' + req.session.account.id +'/my_note');
   			 }
		});
	},

	delNote: function(req, res, next){
		checkStudentAccount(req, res);
		Note.remove({stu_account: req.session.account.name, title:req.params.title}, function(error){
		    if(error) {
		        req.session.flash = {
				type: 'danger',intro: '',
				message: '删除失败，数据库发生了问题，请重试！',
			};
			return res.redirect(303, '/student/'+req.session.account.id+'/my_note');
		    } else {
		       	req.session.flash = {
				type:'success', intro:'',
				message:req.params.title+'日记删除成功！',
			}
			res.redirect(303, '/student/' + req.session.account.id +'/my_note');
		    }
		});
	},

	myQuestion: function(req, res, next) {
		checkStudentAccount(req, res);
		Student.findById(req.params.id, function(err, student) {
			if(err) return next(err);
			if(!student) return next(); 	// pass this on to 404 handler
			student.getAnswers(function(err, answers) {
				if(err) return next(err);
				student.getQuestions(function(err, questions){
					if(err) return next(err);
					res.render('student/my_question', studentViewModel.getMyQuestions(answers, questions));
				})
			});
		});
	},

	writeQuestion: function(req, res, next) {
		checkStudentAccount(req, res);
		if(!req.session.questionform) req.session.questionform = {'name':'','tag':'','content':''};
		res.locals.questionform = req.session.questionform;
		res.render('student/write_question');
	},

	processWriteQuestion: function(req, res, next) {
		req.session.questionform = { 
			'name':req.body.name, 
			'tag':req.body.tag,
			'content':req.body.content,
			'stu_account':req.session.account.name,
		};
		Question.findOne({name:req.body.name},function(err, question){
			if(err) return next(err);
			if(question) {
				req.session.flash = {
					type:'danger', intro:'',
					message:'已经有同名称的问题了！!',
				}
				return res.redirect(303, '/student/'+req.session.account.id+'/write_question');
			}
			else{
				var c = new Question(req.session.questionform);
				c.save(function(err) {
					if(err) {
						if(req.xhr) return res.json({ error: '提交失败.' });
						req.session.flash = {
							type: 'danger',intro: '',
							message: '数据库发生了问题，请重试一次',
						};
						return res.redirect(303, '/student/'+req.session.account.id+'/write_question');
					}
					if(req.xhr) return res.json({ success: true });
					req.session.flash = {
						type:'success', intro:'',
						message:'问题提交成功！',
					}
					delete req.session.questionform;
					res.redirect(303, '/question/list');
				});
				
			}
		});
	},


	processWriteAnswer: function(req, res, next) {
		req.session.answerform = { 
			'content':req.body.content,
			'stu_account':req.session.account.name,
			'question_name':req.session.question.name,
		};
		var c = new Answer(req.session.answerform);
		c.save(function(err) {
			if(err) {
				if(req.xhr) return res.json({ error: '提交失败.' });
				req.session.flash = {
					type: 'danger',intro: '',
					message: '数据库发生了问题，请重试一次',
				};
				return res.redirect(303, '/question/'+req.session.question.id+'/preferences');
			}
			if(req.xhr) return res.json({ success: true });
			req.session.flash = {
				type:'success', intro:'',
				message:'回答提交成功！',
			}
			delete req.session.answerform;
			res.redirect(303, '/question/'+req.session.question.id+'/preferences');
		});
	},


	myAccount:function(req, res, next) {
		checkStudentAccount(req, res);
		Student.findOne({account:req.session.account.name},function(err, student){
			if(err) return next(err);
			if(!student) return next(); 
			res.render('student/my_account',studentViewModel.getMyAccount(student));
		})
	},

	updatePassword: function(req, res, next) {
		checkStudentAccount(req, res);
		res.render('student/update_password');
	},

	processUpdatePassword: function(req, res, next) {
		checkStudentAccount(req, res);
		if(req.body.password1!==req.body.password2) {
			req.session.flash = {
				type:'danger', intro:'',
				message:'两次密码输入不一致!',
			}
			return res.redirect(303, '/student/'+req.session.account.id+'/update_password');
		}
		else{
			Student.findOne({account:req.session.account.name, password:req.body.oldpassword},function(err, student){
				if(err) return next(err);
				if(!student){
					req.session.flash = {
						type:'danger', intro:'',
						message:'原密码错误!',
					}
					return res.redirect(303, '/student/'+req.session.account.id+'/update_password');
				}
				else{
					var conditions = {account: req.session.account.name};
					var update     = {$set : {password : req.body.password1}};
					var options    = {upsert : true};
					Student.update(conditions, update, options, function(error){
			    			if(error) {
			      				  req.session.flash = {
								type: 'danger',intro: '',
								message: '修改失败，数据库发生了问题，请重试！',
							};
							return res.redirect(303, '/student/'+req.session.account.id+'/update_note/'+req.params.title);
			   			 } else {
			      			  	req.session.flash = {
								type:'success', intro:'',
								message:'密码修改成功！',
							}
							res.redirect(303, '/student/' + req.session.account.id +'/my_account');
			   			 }
					});
				}
			});
		}
	},
};