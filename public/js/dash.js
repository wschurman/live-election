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
  smoothie.streamTo(document.getElementById("sentimentcanvas"), 1500);

  var line_1 = new TimeSeries();
  var line_2 = new TimeSeries();

  smoothie.addTimeSeries(line_1, { strokeStyle:'rgb(0, 255, 0)', lineWidth:3 });
  smoothie.addTimeSeries(line_2, { strokeStyle:'rgb(255, 0, 0)', lineWidth:3 });

  now.receiveSentimentData = function(vals) {
    var t = new Date().getTime();

    line_1.append(t, vals[0]); // first floor
    line_2.append(t, vals[1]); // second floor
  }

  now.receiveExitPollResults = function(pos, results) {
    console.log(pos, results);

    $("#position").text(pos);

    $("#people").html("<tr><th>Position</th><th>Name</th></tr>");

    $.each(results, function(result) {
      $("#people").append("<tr><td>"+(result+1)+"</td><td>"+results[result]+"</td></tr>");
    });
  }

  now.updateMyCurrentPosition = function(_, _b) {
    $("#pollsli").click();
  }

});