var Admin = require('../models/admin.js'),
	Student = require('../models/student.js'),
	Course = require('../models/course.js'),
	Note = require('../models/note.js'),
	Question = require('../models/question.js'),
	Answer = require('../models/answer.js'),
	Video= require('../models/video.js'),
	Record= require('../models/record.js'),
	Suggestion = require('../models/suggestion.js'),
	adminViewModel = require('../viewModels/admin.js'),
	studentViewModel = require('../viewModels/student.js'),
	courseViewModel = require('../viewModels/course.js'),
	noteViewModel = require('../viewModels/note.js'),
	questionViewModel = require('../viewModels/question.js');
	path = require('path'),
	fs = require('fs'),
	formidable = require('formidable');

	// make sure data directory exists
	var dataDir = path.normalize(path.join(__dirname, '..', 'public/data'));
	var courseDir = path.join(dataDir, 'course');
	fs.existsSync(dataDir) || fs.mkdirSync(dataDir); 
	fs.existsSync(courseDir) || fs.mkdirSync(courseDir);

function checkAdminAccount(req, res){
	if(!(req.session.role == 'admin' && req.session.account.id == req.params.id))
		return res.redirect(303, '/quit_error');
}

module.exports = {

	registerRoutes: function(app) {
		app.get('/admin/login', this.login);
		app.post('/admin/login', this.processLogin);

		app.get('/admin/:id/admin_home', this.home);

		app.get('/admin/:id/course_list', this.courseList);
		app.get('/admin/:id/course_table', this.courseTable);
		app.get('/admin/:id/course_chart', this.courseChart);
		app.get('/admin/:id/course_chart_data',this.courseChartData);

		app.get('/admin/:id/course_upload', this.courseUpload);
		app.post('/admin/:id/course_upload', this.processCourseUpload);

		app.get('/admin/:id/course_del/:name/:link', this.courseDel);

		app.get('/admin/:id/course_update/:name',this.courseUpdate);
		app.post('/admin/:id/course_update/:name',this.processCourseUpdate);

		app.get('/admin/:id/course_video/:course',this.courseVideo);
		app.post('/admin/:id/video_upload/:course',this.processVideoUpload);
		app.get('/admin/:id/video_del/:course/:name',this.videoDel);

		app.get('/admin/:id/student_list', this.studentList);
		app.get('/admin/:id/student_update/:account', this.studentUpdate);
		app.post('/admin/:id/student_update/:account', this.processStudentUpdate);

		app.get('/admin/:id/question_list', this.questionList);
		app.get('/admin/:id/question_del/:name', this.questionDel);

		app.get('/admin/:id/note_list', this.noteList);
		app.get('/admin/:id/note_del/:student/:title', this.noteDel);

		app.get('/admin/:id/suggestion_list', this.suggestionList);
		app.get('/admin/:id/suggestion_update/:student/:title', this.suggestionUpdate);
		app.post('/admin/:id/suggestion_update/:student/:title', this.processSuggestionUpdate);
		
	},

	login: function(req, res, next) {
		if(req.session.role){
			req.session.flash = {
				type:'danger', intro:'',
				message:'你已登录！返回首页',
			}
			return res.redirect(303, '/');
		}
		res.locals.login = {
			url:"/admin/login",
			role : "管理员"
		}
		res.render('public/login');
	},

	processLogin: function(req, res, next) {
		Admin.findOne({name: req.body.account, password:req.body.password},function(err, admin){
			if(err) return next(err);
			if(!admin) {
				req.session.flash = {
					type:'danger', intro:'',
					message:'管理员名或密码错误!',
				}
			return res.redirect(303, '/admin/login');
			}
			else{
				req.session.role="admin";
				req.session.account = {'id':admin._id,'name':admin.name} ;
				req.session.flash = {
					type:'success', intro:'',
					message:'登录成功！欢迎来到管理主页',
				}
				res.redirect(303, '/admin/' + admin._id+'/admin_home');
			}
		});
	},

	home: function(req, res, next) {
		checkAdminAccount(req, res);
		res.render('admin/home');
	},

	courseList: function(req, res, next) {
		checkAdminAccount(req, res);
		Course.find(function(err, courses) {
			if(err) return next(err);
			res.render('admin/course_list', courseViewModel.getCourseList(courses,''));
		});
	},

	courseTable: function(req, res, next) {
		checkAdminAccount(req, res);
		Course.find(function(err, courses) {
			if(err) return next(err);
			var courseSet = courses.map(function(course){
				return {
					name: course.name,
					tag: course.tag,
					learning: course.learning,
					time: course.time.toString().slice(0,-14),
				};
			});
			res.render('admin/course_table', {courses:courseSet});
		});
	},

	courseChart: function(req, res, next) {
		checkAdminAccount(req, res);
		res.render('admin/course_chart');
	},

	courseChartData: function(req, res, next) {
		checkAdminAccount(req, res);
		var timeSet = [
		{"$gte":"2015-3-1 0:0:0","$lt":"2015-4-1 0:0:0"},
		{"$gte":"2015-4-1 0:0:0","$lt":"2015-5-1 0:0:0"},
		{"$gte":"2015-5-1 0:0:0","$lt":"2015-6-1 0:0:0"},
		{"$gte":"2015-6-1 0:0:0","$lt":"2015-7-1 0:0:0"},
		];
		var dataSet = [
				        {
				            name:'Java',
				            type:'bar',
				            data:[],
				            markPoint : {
				                data : [
				                    {type : 'max', name: '最大值'},
				                    {type : 'min', name: '最小值'}
				                ]
				            },
				            markLine : {
				                data : [
				                    {type : 'average', name: '平均值'}
				                ]
				            }
				        },
				        {
				            name:'Android',
				            type:'bar',
				            data:[],
				            markPoint : {
				                data : [
				                    {type : 'max', name: '最大值'},
				                    {type : 'min', name: '最小值'}
				                ]
				            },
				            markLine : {
				                data : [
				                    {type : 'average', name : '平均值'}
				                ]
				            }
				        },{
				            name:'IOS',
				            type:'bar',
				            data:[],
				            markPoint : {
				                data : [
				                    {type : 'max', name: '最大值'},
				                    {type : 'min', name: '最小值'}
				                ]
				            },
				            markLine : {
				                data : [
				                    {type : 'average', name: '平均值'}
				                ]
				            }
				        },   {
				            name:'PHP',
				            type:'bar',
				            data:[],
				            markPoint : {
				                data : [
				                    {type : 'max', name: '最大值'},
				                    {type : 'min', name: '最小值'}
				                ]
				            },
				            markLine : {
				                data : [
				                    {type : 'average', name : '平均值'}
				                ]
				            }
				        },   {
				            name:'Node.js',
				            type:'bar',
				            data:[],
				            markPoint : {
				                data : [
				                    {type : 'max', name: '最大值'},
				                    {type : 'min', name: '最小值'}
				                ]
				            },
				            markLine : {
				                data : [
				                    {type : 'average', name : '平均值'}
				                ]
				            }
				        },
				    ];
		var count=0;
				Record.find(
					{
						tag:'Java',
						'time':timeSet[0]
					},function(err,courses){
						count++;
						if(err) return next(err);
						if(courses){
							dataSet[0].data[0]=courses.length;
						}
						else{
							dataSet[0].data[0]=0;
						}
						Record.find(
							{
								tag:'Java',
								'time':timeSet[1]
							},function(err,courses){
								count++;
								if(err) return next(err);
								if(courses){
									dataSet[0].data[1]=courses.length;
								}
								else{
									dataSet[0].data[1]=0;
								}
								Record.find(
								{
									tag:'Java',
									'time':timeSet[2]
								},function(err,courses){
									count++;
									if(err) return next(err);
									if(courses){
										dataSet[0].data[2]=courses.length;
									}
									else{
										dataSet[0].data[2]=0;
									}
									Record.find(
										{
											tag:'Java',
											'time':timeSet[3]
										},function(err,courses){
											count++;
											if(err) return next(err);
											if(courses){
												dataSet[0].data[3]=courses.length;
											}
											else{
												dataSet[0].data[3]=0;
											}
											if(count==20){
												res.send(dataSet);
											}
										})
									})

							})
					})

			Record.find(
					{
						tag:'Android',
						'time':timeSet[0]
					},function(err,courses){
						count++;
						if(err) return next(err);
						if(courses){
							dataSet[1].data[0]=courses.length;
						}
						else{
							dataSet[1].data[0]=0;
						}
						Record.find(
							{
								tag:'Android',
								'time':timeSet[1]
							},function(err,courses){
								count++;
								if(err) return next(err);
								if(courses){
									dataSet[1].data[1]=courses.length;
								}
								else{
									dataSet[1].data[1]=0;
								}
								Record.find(
								{
									tag:'Android',
									'time':timeSet[2]
								},function(err,courses){
									count++;
									if(err) return next(err);
									if(courses){
										dataSet[1].data[2]=courses.length;
									}
									else{
										dataSet[1].data[2]=0;
									}
									Record.find(
										{
											tag:'Android',
											'time':timeSet[3]
										},function(err,courses){
											count++;
											if(err) return next(err);
											if(courses){
												dataSet[1].data[3]=courses.length;
											}
											else{
												dataSet[1].data[3]=0;
											}
											if(count==20){
												res.send(dataSet);
											}
										})
									})

							})
					})

			Record.find(
					{
						tag:'IOS',
						'time':timeSet[0]
					},function(err,courses){
						count++;
						if(err) return next(err);
						if(courses){
							dataSet[2].data[0]=courses.length;
						}
						else{
							dataSet[2].data[0]=0;
						}
						Record.find(
							{
								tag:'IOS',
								'time':timeSet[1]
							},function(err,courses){
								count++;
								if(err) return next(err);
								if(courses){
									dataSet[2].data[1]=courses.length;
								}
								else{
									dataSet[2].data[1]=0;
								}
								Record.find(
								{
									tag:'IOS',
									'time':timeSet[2]
								},function(err,courses){
									count++;
									if(err) return next(err);
									if(courses){
										dataSet[2].data[2]=courses.length;
									}
									else{
										dataSet[2].data[2]=0;
									}
									Record.find(
										{
											tag:'IOS',
											'time':timeSet[3]
										},function(err,courses){
											count++;
											if(err) return next(err);
											if(courses){
												dataSet[2].data[3]=courses.length;
											}
											else{
												dataSet[2].data[3]=0;
											}
											if(count==20){
												res.send(dataSet);
											}
										})
									})

							})
					})
			
			Record.find(
					{
						tag:'PHP',
						'time':timeSet[0]
					},function(err,courses){
						count++;
						if(err) return next(err);
						if(courses){
							dataSet[3].data[0]=courses.length;
						}
						else{
							dataSet[3].data[0]=0;
						}
						Record.find(
							{
								tag:'PHP',
								'time':timeSet[1]
							},function(err,courses){
								count++;
								if(err) return next(err);
								if(courses){
									dataSet[3].data[1]=courses.length;
								}
								else{
									dataSet[3].data[1]=0;
								}
								Record.find(
								{
									tag:'PHP',
									'time':timeSet[2]
								},function(err,courses){
									count++;
									if(err) return next(err);
									if(courses){
										dataSet[3].data[2]=courses.length;
									}
									else{
										dataSet[3].data[2]=0;
									}
									Record.find(
										{
											tag:'PHP',
											'time':timeSet[3]
										},function(err,courses){
											count++;
											if(err) return next(err);
											if(courses){
												dataSet[3].data[3]=courses.length;
											}
											else{
												dataSet[3].data[3]=0;
											}
											if(count==20){
												res.send(dataSet);
											}
										})
									})

							})
					})
			Record.find(
					{
						tag:'Node',
						'time':timeSet[0]
					},function(err,courses){
						count++;
						if(err) return next(err);
						if(courses){
							dataSet[4].data[0]=courses.length;
						}
						else{
							dataSet[4].data[0]=0;
						}
						Record.find(
							{
								tag:'Node',
								'time':timeSet[1]
							},function(err,courses){
								count++;
								if(err) return next(err);
								if(courses){
									dataSet[4].data[1]=courses.length;
								}
								else{
									dataSet[4].data[1]=0;
								}
								Record.find(
								{
									tag:'Node',
									'time':timeSet[2]
								},function(err,courses){
									count++;
									if(err) return next(err);
									if(courses){
										dataSet[4].data[2]=courses.length;
									}
									else{
										dataSet[4].data[2]=0;
									}
									Record.find(
										{
											tag:'Node',
											'time':timeSet[3]
										},function(err,courses){
											count++;
											if(err) return next(err);
											if(courses){
												dataSet[4].data[3]=courses.length;
											}
											else{
												dataSet[4].data[3]=0;
											}
											if(count==20){
												res.send(dataSet);
											}
										})
									})

							})
					})
		
	},

	courseUpload: function(req, res, next){
		checkAdminAccount(req, res);
		res.render('admin/course_upload');
	},

	processCourseUpload: function(req, res, next) {
		checkAdminAccount(req, res);
		 var form = new formidable.IncomingForm();
		    form.parse(req, function(err, fields, files){
		        if(err) {
		            res.session.flash = {
		                type: 'danger',
		                intro: '',
		                message: '提交出现问题，请重试！ ' 
		            };
		            return res.redirect(303, '/admin/'+req.session.account.id+'/course_upload');
		        }	
		        Course.findOne({name: fields.name},function(err, course){
			if(err) return next(err);
			if(course) {
				req.session.flash = {
					type:'danger', intro:'',
					message:'此课程名已被用！',
				}
			return res.redirect(303, '/admin/'+req.session.account.id+'/course_upload');
			}
			else{
				var date = Date.now();
				 var photo = files.photo;
				 var dir = courseDir + '/' +fields.name;
				 var path = dir + '/' + date + photo.name;
				 var pathsave = '/data/course/'+fields.name+'/' + date + photo.name;
				 fs.existsSync(dir) || fs.mkdirSync(dir); 
				 var readStream=fs.createReadStream(photo.path);
		         		 var writeStream=fs.createWriteStream(path);
				 readStream.pipe(writeStream);
				 readStream.on('end',function(){
				     	 fs.unlinkSync(photo.path);
				        });

				 var c = new Course({
					name: fields.name,
					tag: fields.tag,
					grade:fields.grade,
					info:fields.info,
					book:fields.book,
					code:fields.code,
					practice: fields.practice,
					img:pathsave,
				});
				c.save(function(err) {
					if(err) {
						if(req.xhr) return res.json({ error: '上传失败.' });
						req.session.flash = {
							type: 'danger',
							intro: '',
							message: '上传失败，数据库发生了问题，请重试一次',
						};
						return res.redirect(303, '/admin/'+req.session.account.id+'/course_upload');
					}
					if(req.xhr) return res.json({ success: true });
					req.session.flash = {
					            type: 'success',
					            intro: '',
					            message: '上传成功！',
					        };
					 return res.redirect(303, '/admin/'+req.session.account.id+'/course_list');
				});
			}
		       });
		 });
	},

	courseUpdate: function(req, res, next){
		checkAdminAccount(req, res);
		Course.findOne({name:req.params.name}, function(err, course) {
			if(err) return next(err);
			if(!course) return next(); 	// pass this on to 404 handler
			res.render('admin/course_update', course);
			
		});
	},

	processCourseUpdate: function(req, res, next) {
		checkAdminAccount(req, res);
		 var form = new formidable.IncomingForm();
		 form.parse(req, function(err, fields, files){
		        if(err) {
		            res.session.flash = {
		                type: 'danger',
		                intro: '',
		                message: '修改出现问题，请重试！ ' 
		            };
		            return res.redirect(303, '/admin/'+req.session.account.id+'/course_update/'+req.params.name);
		        }	
			var photo = files.photo;
			 if(photo.name!=''){
			 	var date = Date.now();
			 	 var dir = courseDir + '/' +req.params.name;
				 var path = dir + '/' + date + photo.name;
				 var pathsave = '/data/course/'+req.params.name+'/'+date + photo.name;
				 fs.existsSync(dir) || fs.mkdirSync(dir); 
				 var readStream=fs.createReadStream(photo.path);
		         		 var writeStream=fs.createWriteStream(path);
				 readStream.pipe(writeStream);
				 readStream.on('end',function(){
				     	 fs.unlinkSync(photo.path);
				 });
				 var update = {$set : { info : fields.info, tag : fields.tag, img:pathsave, grade:fields.grade, book:fields.book, code:fields.code, practice:fields.practice}};
			 }
			else{
				 var update     = {$set : { info : fields.info, tag : fields.tag ,grade:fields.grade, book:fields.book, code:fields.code, practice:fields.practice}};
			}
		        var conditions = {name: req.params.name};
		        var options    = {upsert : true};
		        Course.update(conditions, update, options, function(error){
    			if(error) {
      				  req.session.flash = {
					type: 'danger',intro: '',
					message: '修改失败，数据库发生了问题，请重试！',
				};
				return res.redirect(303, '/admin/'+req.session.account.id+'/course_update/'+req.params.name)
   			 } else {
      			  	req.session.flash = {
					type:'success', intro:'',
					message:'课程信息修改成功！',
				}
				res.redirect(303, '/admin/' + req.session.account.id +'/course_list');
   			 }
		        });	
		});
	},

	courseDel: function(req, res, next){
		checkAdminAccount(req, res);
		Course.remove({name :req.params.name }, function(error){
		    if(error) {
		        req.session.flash = {
				type: 'danger',intro: '',
				message: '删除失败，数据库发生了问题，请重试！',
			};
			return res.redirect(303, '/admin/'+req.session.account.id+'/course_list');
		    } else {
		    	Video.remove({course_name : req.params.name }, function(error){
		   		 if(error) {
		   		 	req.session.flash = {
						type:'success', intro:'',
						message:'删除 '+req.params.name +' 成功！',
					}
					return res.redirect(303, '/admin/'+req.session.account.id+'/course_list');
				    } else {
				       	req.session.flash = {
						type:'success', intro:'',
						message:'删除 '+req.params.name +' 成功！',
					}
					if(req.params.link == 'list')
					res.redirect(303, '/admin/' + req.session.account.id +'/course_list');
				else res.redirect(303, '/admin/' + req.session.account.id +'/course_table');
		 		   }
			});
		    }
		});
	},

	courseVideo:function(req, res, next){
		checkAdminAccount(req, res);
		Course.findById(req.params.course, function(err, course) {
			if(err) return next(err);
			if(!course) return next(); 	// pass this on to 404 handler
			course.getVideos(function(err, videos) {
				if(err) return next(err);
				res.render('admin/course_video', courseViewModel.getCoursePreferences(course, videos));
			});
		});
	},

	processVideoUpload: function(req, res, next) {
		checkAdminAccount(req, res);
		 var form = new formidable.IncomingForm();
		    form.parse(req, function(err, fields, files){
		        if(err) {
		            res.session.flash = {
		                type: 'danger',
		                intro: '',
		                message: '提交出现问题，请重试！ ' 
		            };
		            return res.redirect(303, '/admin/'+req.session.account.id+'/course_video/'+req.params.course);
		        }	
		        Video.findOne({course_name: fields.course, name:fields.name},function(err, video){
			if(err) return next(err);
			if(video) {
				console.log('video');
				req.session.flash = {
					type:'danger', intro:'',
					message:'此课程已有同样名称的章节了！',
				}
			return res.redirect(303, '/admin/'+req.session.account.id+'/course_video/'+req.params.course);
			}
			else{
				var date = Date.now();
				 var video = files.video;
				 var dir = courseDir + '/' +fields.course;
				 var path = dir + '/' + date + video.name;
				 var pathsave = '/data/course/'+fields.course+'/' + date + video.name;
				 fs.existsSync(dir) || fs.mkdirSync(dir); 
				 var readStream=fs.createReadStream(video.path);
		         		 var writeStream=fs.createWriteStream(path);
				 readStream.pipe(writeStream);
				 readStream.on('end',function(){
				     	 fs.unlinkSync(video.path);
				        });
				 var indexNumber = parseInt(fields.index);
				 var c = new Video({
					name: fields.name,
					index : indexNumber,
					url : pathsave,
					course_name : fields.course
				});
				c.save(function(err) {
					if(err) {
						if(req.xhr) return res.json({ error: '上传失败.' });
						req.session.flash = {
							type: 'danger',
							intro: '',
							message: '上传失败，数据库发生了问题，请重试一次',
						};
						return res.redirect(303, '/admin/'+req.session.account.id+'/course_video/'+req.params.course);
					}
					if(req.xhr) return res.json({ success: true });
					req.session.flash = {
					            type: 'success',
					            intro: '',
					            message: '上传成功！',
					        };
					 return res.redirect(303, '/admin/'+req.session.account.id+'/course_video/'+req.params.course);
				});
			}
		       });
		 });
	},

	videoDel: function(req, res, next){
		checkAdminAccount(req, res);
		Course.findOne({ name : req.params.course },function(err, course){
			if(err) {
			        req.session.flash = {
					type: 'danger',intro: '',
					message: '此课程不存在！请重试！',
				};
				return res.redirect(303, '/admin/'+req.session.account.id+'/course_list');
			}
			else{
				Video.remove({name : req.params.name , course_name:req.params.course }, function(error){
					 if(error) {
					        req.session.flash = {
							type: 'danger',intro: '',
							message: '章节删除失败，请重试！',
						};
						return res.redirect(303, '/admin/'+req.session.account.id+'/course_video/'+course._id);
					} else {
					       	req.session.flash = {
							type:'success', intro:'',
							message:'关于 '+req.params.name +' 的问题删除成功！',
						}
						res.redirect(303, '/admin/' + req.session.account.id +'/course_video/'+course._id);
					 }    
				});
			}
		})
		
	},

	questionList: function(req, res, next) {
		checkAdminAccount(req, res);
		Question.find(function(err, questions) {
			if(err) return next(err);
			res.render('admin/question_list', questionViewModel.getQuestionList(questions,''));
		});
	},

	questionDel: function(req, res, next){
		checkAdminAccount(req, res);
		Question.remove({name :req.params.name }, function(error){
		    if(error) {
		        req.session.flash = {
				type: 'danger',intro: '',
				message: '删除失败，数据库发生了问题，请重试！',
			};
			return res.redirect(303, '/admin/'+req.session.account.id+'/question_list');
		    } else {
		    	Answer.remove({question_name : req.params.name }, function(error){
		   		 if(error) {
		   		 	req.session.flash = {
						type:'success', intro:'',
						message:'关于 '+req.params.name +' 的问题删除成功！',
					}
					return res.redirect(303, '/admin/'+req.session.account.id+'/question_list');
				    } else {
				       	req.session.flash = {
						type:'success', intro:'',
						message:'关于 '+req.params.name +' 的问题删除成功！',
					}
					res.redirect(303, '/admin/' + req.session.account.id +'/question_list');
		 		   }
			});
		    }
		});
	},

	noteList: function(req, res, next) {
		checkAdminAccount(req, res);
		Note.find(function(err, notes) {
			if(err) return next(err);
			res.render('admin/note_list', noteViewModel.getNoteList(notes,''));
		});
	},

	noteDel: function(req, res, next){
		checkAdminAccount(req, res);
		Note.remove({stu_account: req.params.student, title:req.params.title}, function(error){
		    if(error) {
		        req.session.flash = {
				type: 'danger',intro: '',
				message: '删除失败，数据库发生了问题，请重试！',
			};
			return res.redirect(303, '/admin/'+req.session.account.id+'/note_list');
		    } else {
		       	req.session.flash = {
				type:'success', intro:'',
				message:req.params.student+'的'+req.params.title+'删除成功！',
			}
			res.redirect(303, '/admin/' + req.session.account.id +'/note_list');
		    }
		});
	},

	suggestionList: function(req, res, next) {
		checkAdminAccount(req, res);
		Suggestion.find(function(err, suggestions) {
			if(err) return next(err);
			var suggestionSet = suggestions.map(function(suggestion){
				var flag = true;
				if(suggestion.reply!='暂无回复')flag=false;
				return {
					title: suggestion.title,
					content: suggestion.content,
					stu_account: suggestion.stu_account,
					time: suggestion.time.toString().slice(0,-14),
					reply: suggestion.reply,
					replyed: flag,
				};
			});
			res.render('admin/suggestion_list', {suggestions: suggestionSet});
		});
	},

	suggestionUpdate: function(req, res, next) {
		checkAdminAccount(req, res);
		Suggestion.findOne({stu_account: req.params.student, title: req.params.title},function(err, suggestion) {
			if(err) return next(err);
			res.render('admin/suggestion_update', suggestion);
		});
	},

	processSuggestionUpdate: function(req, res, next) {
		checkAdminAccount(req, res);
		Suggestion.findOne({stu_account: req.params.student, title: req.params.title},function(err, suggestion) {
			if(err) return next(err);
			if(!suggestion) return next();
			suggestion.reply = req.body.reply;
			suggestion.save();
			req.session.flash = {
				type:'success', intro:'',
				message:'回复成功!',
			}
			Student.findOne({account: req.params.student},function(err, student){
				student.exp += parseInt(req.body.exp);
				student.save();
			})
			res.redirect(303, '/admin/'+req.session.account.id+'/suggestion_list');
		});
	},

	studentList: function(req, res, next) {
		checkAdminAccount(req, res);
		Student.find(function(err, students) {
			if(err) return next(err);
			res.render('admin/student_list', studentViewModel.getStudentList(students));
		});
	},

	studentUpdate: function(req, res, next) {
		checkAdminAccount(req, res);
		Student.findOne({account:req.params.account},function(err, student){
			if(err) return next(err);
			if(!student) {
				req.session.flash = {
					type:'danger', intro:'',
					message:'无此用户!',
				}
				return res.redirect(303, '/admin/'+req.session.account.id+'/student_list');
			}
			else{
				res.render('admin/student_update',studentViewModel.getStudentAccount(student));
			}
		})
	},

	processStudentUpdate: function(req, res, next) {
		checkAdminAccount(req, res);
		var conditions = {account: req.body.account};
		var update     = {$set : {name : req.body.name, exp : req.body.exp}};
		var options    = {upsert : true};
		Student.update(conditions, update, options, function(error){
    			if(error) {
      				  req.session.flash = {
					type: 'danger',intro: '',
					message: '修改失败，数据库发生了问题，请重试！',
				};
				return res.redirect(303, '/admin/'+req.session.account.id+'/student/'+req.body.account);
   			 } else {
      			  	req.session.flash = {
					type:'success', intro:'',
					message:'学生信息修改成功！',
				}
				res.redirect(303, '/admin/' + req.session.account.id +'/student_list');
   			 }
		});
				
	},

};
