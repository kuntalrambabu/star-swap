castMembers = [
  {name: "Judy Garland", code: "162656962", photo: "judy.jpg" },
  {name: "Ray Bolger", code: "326433952", photo: "ray.jpg" },
  {name: "Jack Haley", code: "326433953", photo: "jack.jpg" },
  {name: "Bert Lahr", code: "326433954", photo: "bert.jpg" },
  {name: "Margaret Hamilton", code: "651717534", photo: "margaret.jpg" }
];

$(document).ready(function(){
  restart(castMembers);

});

function restart(castmembers) {
  $('#names').empty();
  $('#faces').empty();
  $('#score-reveal').html("<button class='btn btn-info pull-right' id='score-quiz'>Score Quiz</button>");
  buildQuiz(castMembers);
  initQuiz();

  $("#score-quiz").click(function(){
    scoreQuiz();
    $("button#restart").click(function(){
      restart();
    });
  });
}

function scoreQuiz(){
  var correctAnswers = $(".correct").length;
  var incorrectAnswers = $(".incorrect").length;

  $('.correct').addClass('reveal');
  $('#score-reveal').html("<p class='display-score'>You got <strong>" + correctAnswers + "/5</strong> correct. Would you like to <button id='restart' class='btn btn-info'>TRY AGAIN</button>?</p>");
}

function buildQuiz(castMembers) {
  castMembers.forEach(function(castMember) {
  });
  var shuffledCMs = castMembers.slice('');
  shuffle(shuffledCMs);

  $.each(castMembers, function(index, castMember) {
    $("#names").append("<div class='col-xs-2'>" +
                         "<div class='dropzone'>" +
                           "<div data-match-code='" + castMember.code + "'class='name'>" +
                             castMember.name +
                           "</div>"+
                         "</div>" +
                       "</div>");
  });

  $.each(shuffledCMs, function(index, castMember) {
     $("#faces").append("<div class='col-xs-2'>" +
                          "<div class='center-block frame'>" +
                            "<img class='center-block face' src='images/"+ castMember.photo + "'>" +
                            "<br>" +
                            "<div data-match-code='" + castMember.code + "'class='dropzone'>" +
                          "</div>" +
                        "</div>");
  });
  $("#faces:first-child").addClass("col-xs-offset-1");
  $("#names:first-child").addClass("col-xs-offset-1");
}

function shuffle(arr) {
    for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
}

function initQuiz() {
  $(".name").draggable({
    revert: true,
    revertDuration: 200,
    cursor: "move"
  });

  $(".dropzone").droppable({
    accept: ".name",
    drop: function(event, ui) {
      ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
      ui.draggable.draggable( 'option', 'revert', false );
      if ($(this).data("matchCode") == ui.draggable.data("matchCode")) {
        ui.draggable.addClass("correct");
      } else {
        ui.draggable.removeClass("correct");
      }
    }
  });

  $("#score-quiz").show();

}
