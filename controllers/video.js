var Video = require('../models/video.js');
var VideoViewModel = require('../viewModels/video.js');

module.exports = {
	registerRoutes: function(app) {
		app.get('/video/:id/play', this.play);
	},

	play: function(req, res, next) {
		Video.findById(req.params.id, function(err, video) {
			if(err) return next(err);
			if(!video) return next(); 	// pass this on to 404 handler
			res.render('video/play', videoViewModel.getVideo(video));
		});
	},
};
