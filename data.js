//insert data to mongo
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
