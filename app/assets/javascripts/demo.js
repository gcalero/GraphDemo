jsPlumbInit = function() {
	jsPlumb.importDefaults({
					Connector:"StateMachine",
					PaintStyle:{ lineWidth:3, strokeStyle:"#ffa500", "dashstyle":"2 4" },
					Endpoint:[ "Dot", { radius:5 } ],
					EndpointStyle:{ fillStyle:"#ffa500" }
	});
	
	FB.init({
	      appId      : '594290270605396', // App ID
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	      xfbml      : true  // parse XFBML
	    });
	
	RADIUS = 330;
	FB.Event.subscribe('auth.authResponseChange', function(response) {
	       // Here we specify what we do with the response anytime this event occurs. 

	if (response.status === 'connected') {
		// The response object is returned with a status field that lets the app know the current
	    // login status of the person. In this case, we're handling the situation where they 
	    // have logged in to the app.
		var e0 = null;
		$('#container').empty();
 		FB.api('/me?fields=id,name,picture.height(100px).width(100px)', function(response) {
			if(response.id) {
 				$('#container').append('<div id="nodeMe" class="fbFriend"></div>');
 				$('#nodeMe').append('<div class="friendName">'+response.name+'</div>');
 				$('#nodeMe').append('<img class="friendPicture" src="'+response.picture.data.url+'"/>');
 				$('#nodeMe').css('top', '0px');
 				$('#nodeMe').css('left', '0px');
			} else {
 		 		alert(response.error.message);        
			}
		});

		FB.api('/me/friends?fields=id,name,birthday,picture.height(100px).width(100px)', function(response) {
			if(response.data) {
				var stair = 1;
				$.each(response.data,function(index,friend) {
				$('#container').append('<div id="node'+index+'" class="fbFriend"></div>');
				$('#node'+index).append('<div class="friendName">'+friend.name+'</div>');
				$('#node'+index).append('<img class="friendPicture" src="'+friend.picture.data.url+'"/>');
				$('#node'+index).append('<div class="friendBirthdate">'+(friend.birthday?friend.birthday:"N/A")+'</div>');
				x = stair * RADIUS * Math.cos( (index * 2 - 6) * Math.PI / 12);
				y = stair * RADIUS * Math.sin( (index * 2 - 6) * Math.PI / 12);
				$('#node'+index).css('top', y+'px');
				$('#node'+index).css('left', x+'px');
				e0 = jsPlumb.addEndpoint("nodeMe", { endpoint:"Dot", anchor:[ "Perimeter", { shape:"Circle" } ] });
				e1 = jsPlumb.addEndpoint("node"+index, { endpoint:"Dot", anchor:[ "Perimeter", { shape:"Circle" } ] });
				jsPlumb.connect({ source:e0, target:e1, detachable:false });
				if (index % 12 == 11) {
					stair++;
					if (stair == 3) return false;
				}
		 	    });
				
				jsPlumb.draggable($(".fbFriend"), {
				  containment:"container"
				});
			} else {
		 		alert(response.error.message);        
		 	}
		});
	} else if (response.status === 'not_authorized') {
	 	// In this case, the person is logged into Facebook, but not into the app, so we call
		// FB.login() to prompt them to do so. 
	    // In real-life usage, you wouldn't want to immediately prompt someone to login 
	    // like this, for two reasons:
	    // (1) JavaScript created popup windows are blocked by most browsers unless they 
	    // result from direct interaction from people using the app (such as a mouse click)
	    // (2) it is a bad experience to be continually prompted to login upon page load.
	    FB.login();
	} else {
		// In this case, the person is not logged into Facebook, so we call the login() 
	    // function to prompt them to do so. Note that at this stage there is no indication
	    // of whether they are logged into the app. If they aren't then they'll see the Login
	    // dialog right after they log in to Facebook. 
	    // The same caveats as above apply to the FB.login() call here.
	    FB.login();
	}
	});
 		
	FB.getLoginStatus(function(response) {
		if (response.status !== 'connected') {
			FB.login();
		}
	});
};