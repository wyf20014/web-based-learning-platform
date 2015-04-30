var Video = require('../models/video.js');
var VideoViewModel = require('../viewModels/video.js');

module.exports = {
	registerRoutes: function(app) {
		app.get('/video/play/:tag/:course/:name', this.play);
	},

	play: function(req, res, next) {
		Video.findOne({course_name: req.params.course, name: req.params.name},function(err, video){
			if(err) return next(err);
			if(!video) return next();
			var video_tag = {tag:req.params.tag, video_data: video};
			res.render('video/play',video_tag);
		});
	},
};
