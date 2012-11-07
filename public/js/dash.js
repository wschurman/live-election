$(document).ready(function(){

  var smoothie = new SmoothieChart({
    minValue: -1,
    maxValue: 1,
    millisPerPixel: 40,
    grid: {
      millisPerLine: 2000,
      verticalSections: 2
    }
  });
  smoothie.streamTo(document.getElementById("sentimentcanvas"), 1000);

  var line = new TimeSeries();

  smoothie.addTimeSeries(line, { strokeStyle:'rgb(255, 0, 0)', lineWidth:2 });

  now.receiveSentimentData = function(val) {
    var t = new Date().getTime();

    line.append(t, val);
  }

  now.receiveExitPollResults = function(pos, results) {
    console.log(pos, results);

    $("#position").text(pos);

    $("#people").html("");

    $.each(results, function(result) {
      $("#people").append("<li>"+results[result]+"</li>");
    });
  }

  $("#updateResults").click(function() {
    now.getExitPollResults();
  });

});