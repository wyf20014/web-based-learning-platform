function collectNote(account, note_title, note_id){
			if(confirm('是否要收藏'+note_title+'?')==true){
				$.ajax({
				    	url: "/student/"+account+"/note_collect/"+note_id+"",
				    	type: 'GET',
				    })
				    .done(function(res) {
				    	console.log(res);
				    	if(res) {
				    		alert('收藏成功！');
				    		$('button.collect').removeClass('btn-primary').addClass('btn-danger').html('取消收藏')
				    		.attr('title','点击取消收藏').attr('onclick',"cancelCollectNote('"+account+"','"+note_title+"','"+note_id+"')");
				    	}
				    	else {
				    		alert('收藏失败！请重试');
				    	}
				    })
				    .fail(function(err) {
				    	console.log(err);
				    	alert('收藏失败！请重试')
				    })		       
			};
		}

function cancelCollectNote(account, note_title, note_id){
	if(confirm('是否要取消收藏'+note_title+'?')==true){
		$.ajax({
		    	url : "/student/"+account+"/note_cancel_collect/"+note_id+"",
		    	type: 'GET',
		    })
		    .done(function(res) {
		    	if(res) {
		    		alert('取消收藏成功！');
		    		$('button.collect').addClass('btn-primary').removeClass('btn-danger').html('收藏')
		    		.attr('title','收藏此日记').attr('onclick',"collectNote('"+account+"','"+note_title+"','"+note_id+"')");
		    	}
		    	else alert('取消收藏失败！请重试');
		    })
		    .fail(function() {
		    	alert('取消收藏失败！请重试');
		    })	
	}
}

function cancelMyCollectNote(account, note_title, note_id){
	if(confirm('是否要取消收藏'+note_title+'?')==true){
		$.ajax({
		    	url : "/student/"+account+"/note_cancel_collect/"+note_id+"",
		    	type: 'GET',
		    })
		    .done(function(res) {
		    	if(res) {
		    		alert('取消收藏成功！');
		    		$('#'+note_id).remove();
		    		var num = parseInt($('#note_length')[0].innerHTML.slice(1,-1))-1;
		    		$('#note_length').html('('+num+')');
		    	}
		    	else alert('取消收藏失败！请重试');
		    })
		    .fail(function() {
		    	alert('取消收藏失败！请重试');
		    })	
	}
}

function checkDelCourse(account, name, link){
			if(confirm('是否要删除'+name+'?')==true){
				window.location='/admin/'+account+'/course_del/'+name+'/'+link;
			}
		}