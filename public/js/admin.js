$(document).ready(function(){

  var getPosition = function() {
    return $("#positions button.active").attr("name");
  };

  var getCandidates = function() {
    var names = {};

    $("#people button.active").each(function() {
      names[$(this).attr("name")] = true;
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
  
});