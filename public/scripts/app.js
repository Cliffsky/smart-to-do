
function flashMessage(selector, msg, success) {
  // Change style depding on result
  if (success) {
    $(selector).addClass("alert-success");
    $(selector).removeClass("alert-danger");
  } else {
    $(selector).addClass("alert-danger");
    $(selector).removeClass("alert-success");
  }

  // Show message
  $(selector).show().delay(1500).fadeOut(500);;
  $(selector).text(msg);
}

$( function() {

  $( "#toDoList" ).sortable({
  update: function(e, ui) {

    var data = $("#toDoList").sortable("toArray", {attribute: 'data-id'});

    $.ajax({
      method: 'POST',
      url: '/api/todos/reorder',
      data: {
        ids: data
      }
    }).done((response) => {
      console.log(response);
    });
  }
  });

  // Load Calendar

});
