$(() => {


  var map;
  var service;
  var infowindow;

  function initialize() {
    var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
      });

    var request = {
      location: pyrmont,
      radius: '500',
      query: 'restaurant'
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
  }

  // Checks that the PlacesServiceStatus is OK, and adds a marker
// using the place ID and location from the PlacesService.
function callback(results, status) {

    console.log(results);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var key = $("#GOOGLE_KEY").data("key");
    $.ajax({
      method: "GET",
      crossDomain: true,
      url: "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + results[0].place_id + "&key=" + key
    }).done((results) => {
      for(user of users) {
        $("<div>").text(results).appendTo($("body"));
      }
    });
  }
}
  // Run the initialize function when the window has finished loading.
  google.maps.event.addDomListener(window, 'load', initialize);
});
