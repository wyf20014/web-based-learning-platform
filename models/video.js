var mongoose = require('mongoose');

var videoSchema = mongoose.Schema({
    name: String,
    index: Number,
    url: {type: String, default:""},
    course_name: {type: String, default:""},  //course_id
});

var Video = mongoose.model('Video', videoSchema);

module.exports = Video;