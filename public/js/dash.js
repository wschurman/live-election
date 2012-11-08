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

  var line_1 = new TimeSeries();
  var line_2 = new TimeSeries();

  var l1v = 0.0;
  var l2v = 0.0;

  smoothie.addTimeSeries(line_1, { strokeStyle:'rgb(0, 255, 0)', lineWidth:3 });
  smoothie.addTimeSeries(line_2, { strokeStyle:'rgb(255, 0, 0)', lineWidth:3 });

  now.receiveSentimentData = function(vals) {
    l1v = vals[0]; // first floor
    l2v = vals[1]; // second floor
  };

  var addDataPoint = function() {
    var t = new Date().getTime();

    line_1.append(t, l1v); // first floor
    line_2.append(t, l2v); // second floor
  };

  setInterval(addDataPoint, 500);

  now.receiveExitPollResults = function(pos, results) {
    console.log(pos, results);

    $("#position").text(pos);

    $("#people").html("<tr><th>Name</th><th>% First</th><th>% Second</th></tr>");

    $.each(results, function(result) {
      var res = results[result];

      var fst = res.first * 100;
      var snd = res.second * 100;

      if (fst == 0 && snd == 0) {
        fst = 50;
        snd = 50;
      }

      $("#people").append("<tr><td>"+res.name+"</td><td>"+fst+"%</td><td>"+snd+"%</td></tr>");
    });

    $("#pollsli").click();
  };

  now.updateMyCurrentPosition = function(_, _b) {
    $("#pollsli").click();
  };

  now.switchMeToDebates = function() {
    $("#debatesli").click();
  };

});