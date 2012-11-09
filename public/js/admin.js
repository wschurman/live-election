$(document).ready(function(){

  var getPosition = function() {
    return $("#positions button.active").attr("name");
  };

  var getCandidates = function() {
    var names = {};

    $("#people input").each(function() {
      if ($(this).val() != "") {
        names[$(this).val()] = true;
      }
    });

    return names;
  };

  $("#reset").click(function() {
    now.resetSentiment();
  });

  $("#updatePosition").click(function() {
    
    var active = getPosition();
    var currentCandidates = getCandidates();
    now.updateCurrentPosition(active, currentCandidates);

  });

  $("#updateResults").click(function() {
    now.getExitPollResults();
  });

  $("#switchToDebates").click(function() {
    now.switchToDebates();
  });
  
  $("#submitQuestion").click(function() {
    var q = {};

    q.question = $("#question").val();
    q.ans1 = $("#ans1").val();
    q.ans2 = $("#ans2").val();

    now.addInstantQuestion(q);

    return false;
  });

  
});