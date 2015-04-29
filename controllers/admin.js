var Admin = require('../models/admin.js');
var adminViewModel = require('../viewModels/admin.js');

module.exports = {

	registerRoutes: function(app) {
		app.get('/admin/login', this.login);
		app.post('/admin/login', this.processLogin);

		app.get('/admin/:id/home', this.home);
		
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
				res.redirect(303, '/admin/' + admin._id+'/home');
			}
		});
	},

	home: function(req, res, next) {
		if(req.session.role != 'admin') return next();
		if(req.session.account.id != req.params.id) return next();
		res.render('admin/home');
	},

};
