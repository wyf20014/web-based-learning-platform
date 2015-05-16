module.exports = {
	registerRoutes: function(app) {
		app.get('/', this.home);
		app.get('/quit', this.quit);
		app.get('/quit_error', this.quit_error);
	},

	home: function(req, res, next) {
		res.render('public/home');
	},
	quit: function(req, res, next) {
		 delete req.session.role;
		    req.session.flash = {
		                    type:'success', intro:'',
		                    message:'注销成功！',
		                }
		    res.redirect(303, '/');
	},
	quit_error: function(req, res, next) {
		 delete req.session.role;
		    req.session.flash = {
		                    type:'danger', intro:'',
		                    message:'遇到问题、注销登录！',
		                }
		    res.redirect(303, '/');
	},
};
