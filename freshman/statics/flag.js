var api = "/statics/api.json";
var http = "/statics/flags/";
var ext = ".gif";

var entries = [];
var answer_choice = 0;
var answer_choice_text = "";
var answer_code = "";
var answer_country = "";

var correct_count = 0;
var total = 0;

$.getJSON(api, function(data) {
	$.each(data.Results, function(key, val) {
		if (key != "EU" && key != "AP")
			var tmp_list = [];
	    	tmp_list.push(key);
			tmp_list.push(val.Name);
			entries.push(tmp_list);
	});
});

function initialize() {
	$("#div-flag").html('<img id="flag"/>');
	$("#div-start").remove();
	$("#div-0").html('<button class="btn btn-success answer-btn" id="0" value=""></button>');
	$("#div-1").html('<button class="btn btn-success answer-btn" id="1" value=""></button>');
	$("#div-2").html('<button class="btn btn-success answer-btn" id="2" value=""></button>');
	$("#div-3").html('<button class="btn btn-success answer-btn" id="3" value=""></button>');
	$("#div-result").html('<p id="result"><br/></p>');
	$("#div-line").html('<hr id="line-break">');
	$("#div-quit").html('<button id="quit-btn">Quit</button>');
	$("#span-score").text('Score: ' + correct_count.toString() + ' / ' + total.toString());
	$("#span-time").html('<span class="glyphicon glyphicon-time"></span> <span id="clock"></span>');
}

function getRandomAnswer() {
	var rand = Math.floor(Math.random() * entries.length);
	return rand;
}

function tallyAnswer(answer) {
	if (answer_code == answer) {
		$("#result").text("Correct!");
		$("#result").animate({opacity: '1.0'}, 200);
		$("#result").animate({opacity: '0.0', top: '+=10'}, 400);
		correct_count++;
		total++;
	} else {
		$("#result").text("Wrong...");
		$("#result").animate({opacity: '1.0'}, 100);
		$("#result").animate({opacity: '0.0', top: '+=10'}, 400);
		total++;
	}
}

function changeQuestion() {
	var rand = getRandomAnswer();
	answer_code = entries[rand][0];
	answer_country = entries[rand][1];
	entries.splice(rand, 1);
	$("#flag").attr("src", http + answer_code.toLowerCase() + ext);
	answer_choice = Math.floor(Math.random() * 4);
	answer_choice_text = "#" + answer_choice.toString();
	for (var tmp = 0; tmp < 4; tmp++) {
		if (tmp == answer_choice) {
			$(answer_choice_text).val(answer_code);
			$(answer_choice_text).text(answer_country);
		} else {
			var rand = getRandomAnswer();
			$("#" + tmp.toString()).text(entries[rand][1]);
		}
	}
	$("#span-score").text('Score: ' + correct_count.toString() + ' / ' + total.toString());
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

function finish() {
	alert("Your total score is: " + correct_count.toString() + " / " + total.toString());
	$.ajax({
		url: "/add_flag/",
		type: "POST",
		data: {'score': correct_count},
		success: function() {
			console.log("success");
		},
		error: function() {
			console.log("failure");
		}
	})
	location.reload();
}

$(document).ready(function() {
	$("#start-btn").on("click", function() {
		initialize();
		changeQuestion();

		var fiveSeconds = new Date().getTime() + 6000;
		$('#clock').countdown(fiveSeconds, {elapse: false})
			.on('update.countdown', function(event) {$(this).html(event.strftime('<span>%M:%S</span>'));})
			.on('finish.countdown', function (event) {
				$("#clock").countdown(new Date().getTime() + 6000);
				tallyAnswer('XX');
				changeQuestion();
			});

		$(".answer-btn").on("click", function() {
			tallyAnswer($(this).val());
			changeQuestion();

			$('#clock').countdown("pause");
			fiveSeconds = new Date().getTime() + 6000;
			$('#clock').countdown(fiveSeconds, {elapse: false})

			if (total >= 30) {
				finish();
			}
		});

		$("#quit-btn").on("click", function() {
			finish();
		});
	});
});





