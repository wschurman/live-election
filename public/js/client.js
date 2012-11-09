$(document).ready(function(){

  now.updateMyCurrentPosition = function(pos, cd) {
    $("#position").text(pos);

    $("#candidates").html("");

    $.each(cd, function(candidate, _) {
      $("#candidates").append("<button class='btn' name='"+candidate+"'>"+candidate+"</button>");
    });

    $("#pollsli").click();
  };
  
  now.resetMySentiment = function() {
    // do reset of sentiment
    $("#sentiment button").each(function() {
      $(this).removeClass("active");
    });

    $("#neu").addClass("active");
  }

  $("#floor button").click(function() {
    now.updateFloor(parseInt($(this).attr("data-val")));
  });

  $("#sentiment button").click(function() {
    now.updateSentiment(parseInt($(this).attr("data-val")));
  });

  $("#candidates button").live('click', function() {
    now.voteExitPoll($(this).attr("name"));
  });

  now.switchMeToDebates = function() {
    $("#debatesli").click();
  };

  now.displayInstantQuestion = function(p) {
    $("#question").text(p.question);

    $("#ans1").text(p.ans1);
    $("#ans1").attr("data-val", p.ans1);

    $("#ans2").text(p.ans2);
    $("#ans2").attr("data-val", p.ans2);

    $("#qModal").modal('show');
  }

  $("#anss button").click(function() {
    now.answerInstantQuestion($(this).attr("data-val"));
  });

});