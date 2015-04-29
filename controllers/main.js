module.exports = {
	registerRoutes: function(app) {
		app.get('/', this.home);
		app.get('/quit', this.quit);
		
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
};
