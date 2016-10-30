$(() => {

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
  $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      defaultDate: '2016-09-12',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: [
        {
          title: 'Watch: Matrix',
          start: '2016-09-01',
          color: '#d9534f'
        },
        {
          title: 'Read: Web development',
          start: '2016-09-07',
          end: '2016-09-10',
          color: '#428bca'
        },
        {
          title: 'Buy: Laptop',
          start: '2016-09-09',
          color: '#5cb85c'
        },
        {
          title: 'Eat: Sushi Restaurant',
          start: '2016-09-16',
          color: '#d3d3d3'
        }
      ]
    });

});
