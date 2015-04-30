var Note = require('../models/note.js');
var noteViewModel = require('../viewModels/note.js');

module.exports = {
	registerRoutes: function(app) {
		app.get('/note/list', this.list);
	},

	list: function(req, res, next) {
		if(!req.query.tag) var tag={};
		else{
			var tag = {tag: req.query.tag};
		}
		Note.find(tag,function(err, notes) {
			if(err) return next(err);
			if(!notes) return next(); 
			var tag_id = req.query.tag||'all';
			res.render('note/list', noteViewModel.getNoteList(notes,tag_id));
		});
	},
};
