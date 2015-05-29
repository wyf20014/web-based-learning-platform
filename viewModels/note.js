var Note = require('../models/note.js');

var _ = require('underscore');

module.exports = {

	getNoteList : function(notes, tag){
		var vm = _.map(notes,function(note){
			return _.omit(note,'_id');
		});
		var length = notes.length;
		return {notes:vm,tag:tag,noteLength:length};
	},
};
