$(() => {

  var map;
  var service;
  var infowindow;

  /**
   * Find all places arround a coordinate using google
   * @param {search} string - Search in google places
   */
  function findPlace(search) {
    // Start in Vancouver
    var pyrmont = new google.maps.LatLng(49.256042,-123.2639867);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
      });

    var request = {
      location: pyrmont,
      radius: '2500',
      query: search
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
  }

  /**
   * Return all results from search by google
   * @param {results} object - All places found by google
   * @param {status} object - Google status object
   */
  function callback(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
      placeDetail(results[0].place_id);
    } else if (status == 'ZERO_RESULTS') {
      console.log('Places: NOT FOUND');
    }
  }

  /**
   * Place details from a specific place
   * @param {string} placeId - Place's google Id
   */
  function placeDetail(placeId) {
    // Call API to look for place details
    $.ajax({
      method: 'GET',
      url: '/api/search/places',
      data: {
        search: placeId
      }
    }).done((result) => {
      $('.panelResults').append(result);
    });
  }

  /**
   * Find movie
   * @param {string} search - Movie to search
   */
  function findMovie(search) {
    $.ajax({
      method: 'GET',
      url: '/api/search/movies',
      data: {
        search: search
      }
    }).done((movies) => {

      if(movies.Response == 'True') {
        movies.Search.forEach( function(movie) {
          var row   = $('<div>');
          var p     = $('<p>').text(movie.Title)
          var img   = $('<img>').attr('src',movie.Poster);
          p.appendTo(row);
          img.appendTo(row);
          $('.panelResults').append(row);
        });
      } else {
        console.log('Movies: NOT FOUND');
      }
    });
  }

/*
 * Find book
 * @param {string} search - Book to search
 */

function findBook(search) {
  $.ajax({
    method: 'GET',
    url: '/api/search/books',
    data: {
      search: search
    }
  }).done((books) => {
    books.forEach( function (book) {
          let row   = $('<div>');
          let p     = $('<p>').text(book.title+", by "+book.authors[0])
          let img   = $('<img>').attr('src',book.thumbnail);
          p.appendTo(row);
          img.appendTo(row);
          console.log(row);
          $('.panelResults').append(row);
    });
  });
}

/*
 * Find products/local vendors
 * @param {string} search - Product to search
 */

function findProduct(search) {
  $.ajax({
    method: 'GET',
    url: '/api/search/products',
    data: {
      search: search
    }
  }).done((products) => {

  })
}

  // ----------------------------------------------------------------------------
  // Search

  $('#formSearch').on('submit', function(e) {
    e.preventDefault();
    var search = $('.searchInput').val();

    findProduct(search);
    findPlace(search);
    findBook(search);
    findMovie(search);
  });
});
