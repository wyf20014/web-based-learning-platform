var mongoose = require('mongoose');
var Video = require('./video.js');

var courseSchema = mongoose.Schema({
    name: String,
    tag: {type: String, default:""},
    info: {type: String, default:""},
    img:{type: String, default:""},
    learning:{type: Number, default:0},
});

courseSchema.methods.getVideos = function(cb){
    return Video.find({ course_name: this.name }, cb);
};

var Course = mongoose.model('Course',courseSchema);

module.exports = Course;