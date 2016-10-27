// Connects to OMDb

$(() => {
  var url = "http://www.omdbapi.com/?";
  var key = "s=star+trek"
  $.ajax({
    method: "GET",
    url: url + key,
  }).done((movies) => {
    if (Boolean(movies.Response === "True")) {
      movies.Search.forEach(function (movie) {
        $("<div>").text(movie.Title).appendTo($("body"));
        $("<img>").attr("src", movie.Poster).appendTo($("body"));
      });
    } else {
      $("<div>").text(movies.Error).appendTo($("body"));
    }
  });
});
