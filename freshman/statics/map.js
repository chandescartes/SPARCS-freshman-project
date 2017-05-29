var api = "/statics/api.json";

var width = 0;
var height = 0;
var offset_x = 0;
var offset_y = 0;

var entries = [];
var answer =[];
var total = 0;
var lock = 0;

$.getJSON(api, function(data) {
	$.each(data.Results, function(key, val) {
		if (val.Capital != null) {
			var tmp_list = [];
			tmp_list.push(val.Name);
			tmp_list.push(val.Capital.Name);
			tmp_list.push(val.Capital.GeoPt);
			entries.push(tmp_list);
		}
	});
});

function initialize() {
	var img = document.getElementById("map"); 
	width = img.clientWidth;
	height = img.clientHeight;
	var offsets = realOffset(img);
	offset_x = offsets.left;
	offset_y = offsets.top + 2;
	$("#start-btn").margin;
}

function realOffset(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        console.log(element);
        element = element.offsetParent;
    } while(element);

    return {top: top, left: left};
};

function ll2xy (long, lat) {
	var result = [];
	result.push(width * (180 + long) / 360.0);
	result.push(height * (90 - lat) / 180.0);
	return result;
}

function addScore (x1, y1, x2, y2) {
	var a = (x1 - x2);
	if (a < 0) {a = 0-a;}
	if (a > width/2) {a = width-a;}
	var b = y1 - y2;
	var c = Math.sqrt(a*a + b*b);
console.log(c.toFixed(6));
	if (c > 250) {
		var score = 0;
	} else {
		c = 250 - c;
		var score = (0.0016*c*c);
	}

	total += score;
	$("#div-score-count").text(total.toFixed(2));
	$("#div-score-add").text("+" + score.toFixed(2));
}

function getNextCity() {
	var rand = Math.floor(Math.random() * entries.length);
	answer = entries[rand][2];
	$("#city").html("<b>"+entries[rand][1]+"</b>, "+entries[rand][0]);
	entries.splice(rand, 1);
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (settings.type == 'POST' || settings.type == 'PUT' || settings.type == 'DELETE') {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    }
});

$(document).ready(function() {
	initialize();

 	$("#start-btn").on("click", function() {
 		$(this).remove();
 		$("#div-score-text").text("Score:")
		$("#div-score-count").text(total.toString());
		$("#div-top").html('<span class="glyphicon glyphicon-time"></span> <span id="clock"></span>');
		getNextCity();

		var minute = new Date().getTime() + 60000;
		$('#clock').countdown(minute, {elapse: false})
			.on('update.countdown', function(event) {$(this).html(event.strftime('<span>%M:%S</span>'));})
			.on('finish.countdown', function (event) {
				alert("Your total score is: " + total.toFixed(2));
				$.ajax({
					url: "/add_map/",
					type: "POST",
					data: {'score': Math.round(total*100)/100},
					success: function() {
						console.log("success");
					},
					error: function() {
						console.log("failure");
					},
					complete: function() {
						location.reload();
					},
				});
			});

		$("#map").on("click", function(e) {
			$("#map").css("pointer-events", "none");
			var x = e.clientX + 10;
			var y = e.clientY - 40;

			var real = ll2xy(answer[1], answer[0]);
			var real_x = real[0] + offset_x - 40 + 5 + 1;
			var real_y = real[1] + offset_y - 40 + 5;

			addScore(e.clientX, e.clientY, real_x + 40, real_y + 40);

			var user_pin = "<img id='user-pin' src='/statics/user_pin.png' \
				style='opacity: 0.2; position:absolute; top: " + y.toString() +"px; left: " + x.toString() + "px;'/>";
			$(user_pin).insertAfter(this);

			$("#user-pin").animate({left: '-=10px', top: '+=10px', opacity: '1.0'}, 300, function() {
				$("#user-pin").delay(400).fadeOut(1, function() {
					$("#user-pin").remove();
					lock++;
					if (lock == 2) {
						$("#map").css("pointer-events", "auto");
						lock = 0;
					}
				});
			});

		    var real_pin = "<img id='real-pin' src='/statics/real_pin.png' \
				style='opacity: 0; position:absolute; top: " + real_y.toString() +"px; left: " + real_x.toString() + "px;'/>";
		    $(real_pin).insertAfter(this);

		    $("#real-pin").delay(100).animate({left: '+=10px', top: '+=10px', opacity: '1.0'}, 300, function() {
		    	$("#real-pin").delay(300).fadeOut(1, function() {
		    		$("#real-pin").remove();
		    		lock++;
					if (lock == 2) {
						$("#map").css("pointer-events", "auto");
						lock = 0;
					}
				});
		    });
		    getNextCity();
		    
		})
 	});
});