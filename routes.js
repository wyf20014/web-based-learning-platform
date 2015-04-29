var mainController = require('./controllers/main.js')
var adminController = require('./controllers/admin.js');
var studentController = require('./controllers/student.js');
var courseController = require('./controllers/course.js');

module.exports = function(app){

	mainController.registerRoutes(app);

	adminController.registerRoutes(app);

	studentController.registerRoutes(app);

	courseController.registerRoutes(app);

};