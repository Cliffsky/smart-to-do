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
    }).done((places) => {
      console.log(places);
      showResult(places);
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
        showResult(movies);

    });
  }

  function findBook(search) {
    $.ajax({
      method: 'GET',
      url: '/api/search/books',
      data: {
        search: search
      }
    }).done((books) => {
      showResult(books);
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
      showResult(products);
    });
  }
  /**
   * show Results
   * @param {object}  results - Object with found things from API
   * @param {integer} cateogory - Category Id
   */

  function showResult(data) {

    data.forEach( function(item) {
      var row   = $('<div>');
      var p     = $('<p>').text(item.name)
      var img   = $('<img>').attr('src',item.img);
      p.appendTo(row);
      img.appendTo(row);
      $('#searchResultsContent').append(row);
    });

  }
/*
 * Find book
 * @param {string} search - Book to search
 */


  // ----------------------------------------------------------------------------
  // Search Action

  $('#formSearch').find('a').on('click', function(e) {
    $('#formSearch').submit();
  });


  $('#formSearch').on('submit', function(e) {
    e.preventDefault();
    var search = $('.searchInput').val();

    // Show modal with results
    //$('#searchResultsContent').empty();
    $('#searchResultsTitle').text('Looking for: ' + search);
    $('#searchResults').modal();

    // Find categories
    //findProduct(search);
    //findPlace(search);
    //findBook(search);
    //findMovie(search);
  });

  $('#searchResults').modal();


  $('#watchCarousel > a').on('click', function(e) {
    console.log( $('#watchCarousel .active > a').data('title')  );
  });
});
