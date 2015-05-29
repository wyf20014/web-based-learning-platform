var mongoose = require('mongoose');
var Video = require('./video.js');

var courseSchema = mongoose.Schema({
    name: String,
    tag: {type: String, default:""},
    info: {type: String, default:""},
    img:{type: String, default:""},
    grade:{type: String, default:""},
    learning:{type: Number, default:0},
    time: {type : Date, default: Date.now},
});

courseSchema.methods.getVideos = function(cb){
    return Video.find({ course_name: this.name },cb).sort({"index":1});
};

var Course = mongoose.model('Course',courseSchema);

module.exports = Course;