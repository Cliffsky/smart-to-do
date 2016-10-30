$(() => {

  // google variables
  var map;
  var service;
  var infowindow;

  // Keep Track on number of requests GLOBAL
  var requestsReturned  = 0;
  var requestsSuccess   = 0;

  /**
   * Function to keep track of numbers requests
   * @param {success} boolean - if requested was succesful
   */
  function runAfterRequest(success) {
    success ? requestsSuccess++ : requestsReturned++;

    if ((requestsReturned === 4) && (requestsSuccess === 0)) {
      $('#customList').show();
    }
    //console.log('Total:',requestsReturned, 'Success:', requestsSuccess);
  }

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

    runAfterRequest();

    if (status == google.maps.places.PlacesServiceStatus.OK) {
      $('#eatCarousel').parent().show();

      var max = results.length > 5 ? 5 : results.length;

      for (var i = 0; i < max; i++) {
        placeDetail(results[i].place_id);
      }

      runAfterRequest(true);
    } else if (status == 'ZERO_RESULTS') {
      $('#eatCarousel').parent().hide();
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
      runAfterRequest();

      if (movies.length) {
        showResult(movies);
        $('#watchCarousel').parent().show();
        runAfterRequest(true);
      } else {
        $('#watchCarousel').parent().hide();
      }
    });
  }

  /**
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
      runAfterRequest();
      if (books.length) {
        showResult(books);
        $('#readCarousel').parent().show();
        runAfterRequest(true);
      } else {
        $('#readCarousel').parent().hide();
      }
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
      runAfterRequest();
      if (products.length) {
        showResult(products);
        $('#buyCarousel').parent().show();
        runAfterRequest(true);
      } else {
        $('#buyCarousel').parent().hide();
      }
    });
  }

  /**
   * show Results
   * @param {object}  results - Object with found things from API
   */

  function showResult(data) {

    data.forEach( function(item) {
      // create carousel item
      var el    = $('<div>').addClass('item');
      var a     = $('<a>').addClass('thumbnail').attr('data-name', item.name);
      a.attr('data-category', item.category);
      a.attr('data-length', item.length);
      a.attr('data-id', item.id);

      var img   = $('<img>').attr('src',item.img);
      var p     = $('<p>').text(item.name);
      el.append(a);
      el.append(p);
      a.append(img);

      var carouselId;

      switch(item.category) {
        case 1: carouselId = 'watchCarousel'; break;
        case 2: carouselId = 'eatCarousel'; break;
        case 3: carouselId = 'readCarousel'; break;
        case 4: carouselId = 'buyCarousel'; break;
      }

      $('#' + carouselId + ' > .carousel-inner').append(el);
      $('#' + carouselId + ' > .carousel-inner > div').first().addClass('active');
      $('#' + carouselId).carousel();
    });

  }

  // --------------------------------------------------------------------------
  // Search Action - by button and form submit

  $('#formSearch').find('a').on('click', function(e) {
    var search = $('#formSearch').find('input').val();
    if (search == "") {
      flashMessage('#bodyflashMessage', 'The search can\'t be empty', false);
    } else {
      $('#formSearch').submit();
    }
  });


  $('#formSearch').on('submit', function(e) {
    e.preventDefault();
    var search = $('.searchInput').val();

    // Clear carousel
    $('.carousel-inner').empty();

    // Show modal with results
    $('#searchResultsTitle').text('Looking for: ' + search);
    $('#searchResults').modal();


    // Reset search
    $('#customList').hide();
    $('#eatCarousel').parent().hide();
    $('#watchCarousel').parent().hide();
    $('#readCarousel').parent().hide();
    $('#buyCarousel').parent().hide();

    requestsReturned  = 0;
    requestsSuccess   = 0;

    // Find categories
    findMovie(search);
    findPlace(search);
    findProduct(search);
    findBook(search);
  });
});
