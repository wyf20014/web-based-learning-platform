var http = require('http'),
    express = require('express'),
    Video = require('./models/video.js'),
    Course = require('./models/course.js'),
    jqupload = require('jquery-file-upload-middleware');
    formidable = require('formidable');

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

var MongoSessionStore = require('session-mongoose')(require('connect'));
var sessionStore = new MongoSessionStore({ url: "localhost:27017/test" });

app.use(require('cookie-parser')('secret'));
app.use(require('express-session')({ store: sessionStore }));
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());

// database configuration
var mongoose = require('mongoose');
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};
        mongoose.connect("localhost:27017/test", options);

Course.find(function(err, courses){
    if(courses.length) return;
     new Course({
        name: 'Java基础课程第一天',
        tag: 'Java',
        info: 'Java基础课程系列',
        img:'/img/Java.jpg',
     }).save();

     new Course({
        name: 'PHP错误与异常解决',
        tag: 'PHP',
        info: '归纳常见的PHP运行时所遇到的错误与异常，并提供解决方案',
        img:'/img/PHP_error.jpg',
     }).save();

     new Course({
        name: 'Android动画',
        tag: 'Android',
        info: '详细介绍Android动画的制作方法',
        img:'/img/android.jpg',
     }).save();

     new Course({
        name: 'CSS3+JS实现动画特效',
        tag: 'Node.js',
        info: 'CSS3与JS相结合实现酷炫的图片特效',
        img:'/img/CSS3.jpg',
     }).save();

     new Course({
        name: 'Objective-C',
        tag: 'IOS',
        info: '学习Objective-C的基本语法',
        img:'/img/Objective-C.jpg',
     }).save();
});

Video.find(function(err, videos){
    if(videos.length) return;

    new Video({
        name: '基本常识',
        index: 1,
        url: '/course/Java/java1/1.ogg',
        course_name: 'Java基础课程第一天',  //course_id
    }).save();

     new Video({
        name: 'Java的跨平台性',
        index: 2,
        url: '/course/Java/java1/2.ogg',
        course_name: 'Java基础课程第一天',  //course_id
    }).save();

      new Video({
        name: 'Java环境搭建(安装)',
        index: 3,
        url: '/course/Java/java1/3.ogg',
        course_name: 'Java基础课程第一天',  //course_id
    }).save();

       new Video({
        name: 'java环境搭建(环境变量配置)',
        index: 4,
        url: '/course/Java/java1/4.ogg',
        course_name: 'Java基础课程第一天',  //course_id
    }).save();

});


//根据用户session中role的值决定header显示的内容
app.use(function(req, res, next){
    switch(req.session.role){
        case "admin":
            res.locals.role = {admin:true};
            break;
        case "student":
            res.locals.role = {student:true};
            break;
        default:
            res.locals.role = false;
            break;
    }
    next();
});


app.use(function(req, res, next){
    res.locals.flash = req.session.flash;
    res.locals.account = req.session.account;
    delete req.session.flash;
    next();
});

// set 'showTests' context property if the querystring contains test=1
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' && 
        req.query.test === '1';
    next();
});

// jQuery File Upload endpoint middleware
app.use('/upload', function(req, res, next){
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function(){
            return __dirname + '/public/uploads/' + now;
        },
        uploadUrl: function(){
            return '/uploads/' + now;
        },
    })(req, res, next);
});

// add routes
require('./routes.js')(app);

// add support for auto views
var autoViews = {};

app.use(function(req,res,next){
    var path = req.path.toLowerCase();  
    // check cache; if it's there, render the view
    if(autoViews[path]) return res.render(autoViews[path]);
    // if it's not in the cache, see if there's
    // a .handlebars file that matches
    if(fs.existsSync(__dirname + '/views' + path + '.handlebars')){
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }
    // no view found; pass on to 404 handler
    next();
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('public/404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('public/500');
});

var server;

function startServer() {
    server = http.createServer(app).listen(app.get('port'), function(){
      console.log( 'Express started in ' + app.get('env') +
        ' mode on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.' );
    });
}

if(require.main === module){
    // application run directly; start app server
    startServer();
} else {
    // application imported as a module via "require": export function to create server
    module.exports = startServer;
}
