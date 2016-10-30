/**
 * Flash a error or success message
 * @param {string} msg - Message to dipslay on
 * @param {boolean} success - In error show a red background otherwise green
 */

function flashMessage(msg, success) {
  // Change style depding on result
  if (success) {
    $("#flashMessage").addClass("alert-success");
    $("#flashMessage").removeClass("alert-danger");
  } else {
    $("#flashMessage").addClass("alert-danger");
    $("#flashMessage").removeClass("alert-success");
  }

  // Show message
  $("#flashMessage").show().delay(1500).fadeOut(500);;
  $("#flashMessage").text(msg);
}

$( function() {

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


