$(() => {

const populateCalendar =

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
