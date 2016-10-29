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
      // create carousel item
      var el    = $('<div>').addClass('item');
      var a     = $('<a>').addClass('thumbnail').attr('data-name', item.name);
      a.attr('data-category', item.category);

      var img   = $('<img>').attr('src',item.img);
      el.append(a);
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

    // Clear
    $('.carousel-inner').empty();

    // Show modal with results
    $('#searchResultsTitle').text('Looking for: ' + search);
    $('#searchResults').modal();

    // Find categories
    findMovie(search);
     findPlace(search);
     findProduct(search);
     findBook(search);

  });

  $('.carousel-inner').parent().find('button').on('click', function() {
    var todo = {};
    category_id = $(this).parent().find('.active > a').attr('data-category');
    todo.name   = $(this).parent().find('.active > a').attr('data-name')

    $.ajax({
      method: 'POST',
      url: '/api/todos',
      data: {
        category_id: category_id,
        name: todo.name
      }
    }).done((response) => {
      console.log(response);
    });

  });

});
