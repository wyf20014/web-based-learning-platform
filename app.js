var http = require('http'),
    express = require('express'),
    Admin = require('./models/admin.js'),
    formidable = require('formidable'),
    Record = require('./models/record.js');
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

Admin.find(function(err, admins){
    if(admins.length) return;

    new Admin({
        name: 'admin',
        password:'admin'
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
//1．    管理员统计功能完善，实现按月对比柱状图、增加帮助网站发展决策的统计
//2．  课程学习方式多样化，例如：增添教材连接、课后练习题、论坛讨论，增加分享渠道、分享成功项目代码
