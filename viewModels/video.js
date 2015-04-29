var Video = require('../models/video.js');

var _ = require('underscore');

module.exports = {

	getVideo : function(video){
		var vm = _.omit('_id');
		return vm;
	},
};
