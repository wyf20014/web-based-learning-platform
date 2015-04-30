var mainController = require('./controllers/main.js')
var adminController = require('./controllers/admin.js');
var studentController = require('./controllers/student.js');
var courseController = require('./controllers/course.js');
var noteController = require('./controllers/note.js');
var videoController = require('./controllers/video.js');
var questionController = require('./controllers/question.js');

module.exports = function(app){

	mainController.registerRoutes(app);

	adminController.registerRoutes(app);

	studentController.registerRoutes(app);

	courseController.registerRoutes(app);

	noteController.registerRoutes(app);

	videoController.registerRoutes(app);

	questionController.registerRoutes(app);
};