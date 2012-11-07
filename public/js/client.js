$(document).ready(function(){

  now.updateMyCurrentPosition = function(pos, cd) {
    $("#position").text(pos);

    $("#candidates").html("");

    $.each(cd, function(candidate, _) {
      $("#candidates").append("<button class='btn' name='"+candidate+"'>"+candidate+"</button>");
    });
  }
  
  now.resetMySentiment = function() {
    // do reset of sentiment
    $("#sentiment button").each(function() {
      $(this).removeClass("active");
    });
  }

  $("#sentiment button").click(function() {
    now.updateSentiment(parseInt($(this).attr("data-val")));
  });

  $("#candidates button").live('click', function() {
    now.voteExitPoll($(this).attr("name"));
  });

});