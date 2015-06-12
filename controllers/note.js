var Note = require('../models/note.js');
var noteViewModel = require('../viewModels/note.js');
var Student = require('../models/student.js');
var _ = require('underscore');

module.exports = {
	registerRoutes: function(app) {
		app.get('/note/list', this.list);
		app.get('/note/:id/preferences', this.preferences);

	},

	list: function(req, res, next) {
		if(!req.query.tag) var tag={read_right:1};
		else{
			var tag = {tag: req.query.tag, read_right:1};
		}
		Note.find(tag,function(err, notes) {
			if(err) return next(err);
			if(!notes) return next(); 
			var tag_id = req.query.tag||'all';
			res.render('note/list', noteViewModel.getNoteList(notes,tag_id));
		});
	},

	preferences: function(req, res, next) {
		Note.findById(req.params.id, function(err, note) {
			if(err) return next(err);
			if(!note) return next(); 	// pass this on to 404 handler
			var notSelfFlag = false;
			var collectedFlag = false;
			if(req.session.role!='student'){
				res.render('note/preferences', {
						note: note,
						notSelf : notSelfFlag,
						collected : collectedFlag
					}
				);
			}
			else if(!(note.stu_account==req.session.account.name)){
				notSelfFlag = true;
				Student.findById(req.session.account.id, function(err, student){
					var collections = student.note_collect;
					for(var i=0, length=collections.length; i<length; i++){
						if(collections[i].note_id == req.params.id) {
							collectedFlag=true;
						}
					}
					res.render('note/preferences', {
							note: note,
							notSelf : notSelfFlag,
							collected : collectedFlag
						}
					);
				});
			}
			else{
				res.render('note/preferences', {
						note: note,
						notSelf : notSelfFlag,
						collected : collectedFlag
					}
				);
			}

			
		});
	},
};
