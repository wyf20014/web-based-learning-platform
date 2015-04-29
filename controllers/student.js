var Student = require('../models/student.js');
var Note = require('../models/note.js');
var studentViewModel = require('../viewModels/student.js');

module.exports = {

	registerRoutes: function(app) {
		app.get('/student/register', this.register);
		app.post('/student/register', this.processRegister);

		app.get('/student/login', this.login);
		app.post('/student/login', this.processLogin);

		app.get('/student/:id/my_home', this.myHome);
		app.get('/student/:id/my_course', this.myCourse);
		app.get('/student/:id/my_note', this.myNote);
		app.get('/student/:id/my_question', this.myQuestion);

		app.get('/student/:id/write_note', this.writeNote);
		app.post('/student/:id/write_note', this.processWriteNote);
		
		
	},

	register: function(req, res, next) {
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
					courses:[{
						course_name:'Java基础课程第一天',
						video_name:'基本常识'
					}],
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
		if(req.session.role != 'student')  return next();
		if(req.session.account.id != req.params.id) return next();
		res.render('student/my_home');
	},

	myCourse: function(req, res, next) {
		if(req.session.role != 'student')  return next();
		if(req.session.account.id != req.params.id) return next();
		Student.findById(req.params.id, function(err, student) {
			if(err) return next(err);
			if(!student) return next(); 	// pass this on to 404 handler
			res.render('student/my_course', studentViewModel.getMyCourses(student));
		});
	},

	myNote: function(req, res, next) {
		if(req.session.role != 'student')  return next();
		if(req.session.account.id != req.params.id) return next();
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
		if(req.session.role != 'student')  return next();
		if(req.session.account.id != req.params.id) return next();
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
						return res.redirect(303, '/student/register');
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

	myQuestion: function(req, res, next) {
		if(req.session.role != 'student')  return next();
		if(req.session.account.id != req.params.id) return next();
		res.render('student/my_question');
	},



};