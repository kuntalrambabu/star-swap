$(document).ready(function(){
  $("#start-quiz").click(function(){
    var movieTitle = $("input").val();
    getCastMembers(movieTitle);
    $("#score-quiz").show();
  });

  $("#score-quiz").click(function(){
    var correctAnswers = $(".correct").length;
    var incorrectAnswers = $(".incorrect").length;

    console.log("correct: " + correctAnswers);
  });
});

var CastMember = function (name, matchCode, photo) {
  this.name = name;
  this.code = matchCode;
  this.photo = null;
};

function getCastMembers(movieTitle) {
  getNames(movieTitle, function(castMembers) {
    getPhotos(castMembers, function(castMember, photo) {
      castMember.photo = photo;
    });
    buildQuiz(castMembers);
  });
}

function getNames(movieTitle, callback) {
  var castMembers = [];
  var apikey = "<API_KEY>";
  var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
  var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey;

  $.ajax({
    url: moviesSearchUrl + '&q=' + encodeURI(movieTitle),
    dataType: "jsonp",
    success: function(data) {
      var movie = data.movies[0];
      $.each(movie.abridged_cast, function(index, castMember) {
        castMembers.push(new CastMember(castMember.name, castMember.id));
      });
      if (typeof callback === "function") {
        callback(castMembers);
      }
    }
  });
}

function getPhotos(castMembers, callback) {
  $.map(castMembers, function(index, castMember) {
    $.ajax({
      url:'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + castMember.name,
      type:"GET",
      dataType: 'jsonp',
      async:'false',
      success: function (data) {
        if (typeof callback === "function") {
          callback(castMember, data.responseData.results[0].unescapedUrl);
        }
      }
    });
  });
}

function buildQuiz(castMembers) {
  castMembers.forEach(function(castMember) {
    console.log(castMember);
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
                          "<div class='frame'>" +
                            "<div class='face'>" +
                              castMember.name + "'s photo" +
                            "</div><br>" +
                            "<div data-match-code='" + castMember.code + "'class='dropzone'>" +
                            "</div>" +
                          "</div>" +
                        "</div>");
  });
  $("#faces:first-child").addClass("col-xs-offset-1");
  $("#names:first-child").addClass("col-xs-offset-1");
  initQuiz();
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
}
