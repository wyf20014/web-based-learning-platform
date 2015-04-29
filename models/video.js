var mongoose = require('mongoose');

var vedioSchema = mongoose.Schema({
    name: String,
    index: Number,
    url: {type: String, default:""},
    course_name: {type: String, default:""},  //course_id
});

var Vedio = mongoose.model('Vedio', vedioSchema);

module.exports = Vedio;