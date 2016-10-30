$(() => {

const populateCalendar =

  // Load Calendar
  $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      defaultDate: new Date(),
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: [ { title: 'Terminator 2', start: '2016-10-30', color: '#d9534f' },
  { title: 'Anna Karenina', start: '2016-10-30', color: '#428bca' },
  { title: 'Beer', start: '2016-10-30', color: '#d3d3d3' },
  { title: 'Black Lodge', start: '2016-10-30', color: '#428bca' },
  { title: 'Batteries', start: '2016-10-31', color: '#d3d3d3' },
  { title: 'Bay Sushi', start: '2016-10-31', color: '#428bca' },
  { title: 'Rick and Morty',
    start: '2016-10-31',
    color: '#d9534f' },
  { title: 'Anna Karenina', start: '2016-11-01', color: '#428bca' },
  { title: 'The Wise Hall', start: '2016-11-01', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-02', color: '#428bca' },
  { title: 'Laptop', start: '2016-11-02', color: '#d3d3d3' },
  { title: 'Anna Karenina', start: '2016-11-03', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-04', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-05', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-06', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-07', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-08', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-09', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-10', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-11', color: '#428bca' },
  { title: 'Anna Karenina', start: '2016-11-12', color: '#428bca' },
  { title: 'The Age of Revolution',
    start: '2016-11-13',
    color: '#428bca' },
  { title: 'The Age of Revolution',
    start: '2016-11-14',
    color: '#428bca' },
  { title: 'The Age of Revolution',
    start: '2016-11-15',
    color: '#428bca' },
  { title: 'The Age of Revolution',
    start: '2016-11-16',
    color: '#428bca' },
  { title: 'The Age of Revolution',
    start: '2016-11-17',
    color: '#428bca' },
  { title: 'The Age of Revolution',
    start: '2016-11-18',
    color: '#428bca' },
  { title: 'The Age of Revolution',
    start: '2016-11-19',
    color: '#428bca' },
  { title: 'Weapons of Math Destruction',
    start: '2016-11-20',
    color: '#428bca' } ]
    });

});



function populateCalendar (eventsArray) {
  var date = new Date(); // Gets today's date.
  var timeLeft = (date.getDay() === 0 || date.getDay() === 6) ? We : Wd; // Initialize leisure time.
  var cat = [false, false, false, false]; // Array to check if you've done one of a category in a day;
  var events = []; // Initialize output array.
  var toDos = eventsArray.sort((a, b) => a.priority - b.priority); // Sort input array by order of priority.
  while (toDos.length > 0) {
    for (var i = 0; i < toDos.length; i += 1) {
      if (cat[toDos[i].cat - 1] === false) {
        if (toDos[i].cat === 3) {
          if (toDos[i].length > timeLeft && timeLeft > Rd) {
            timeLeft -= Rd;
            toDos[i].length = toDos[i].length - Rd;
            cat[toDos[i].cat - 1] = true;
            insertToDo(events, date, toDos[i]);
          } else if (timeLeft >= toDos[i].length) {
            timeLeft -= toDos[i].length;
            insertToDo(events, date, toDos[i]);
            cat[toDos[i].cat - 1] = true;
            removeFromList(toDos, i);
          }
        } else {
          if (timeLeft >= toDos[i].length) {
            timeLeft -= toDos[i].length;
            insertToDo(events, date, toDos[i]);
            cat[toDos[i].cat - 1] = true;
            removeFromList(toDos, i);
          }
        }
        if (timeLeft === 0) {
          break;
        }
      }
    }
    date = incrementDate(date);
    cat = cat.map(function (e) {
      return false;
    });
    timeLeft = (date.getDay() === 0 || date.getDay() === 6) ? We : Wd;
  }
  return events;
}

function insertToDo (eventsArray, date, toDo) {
  switch(toDo.cat) {
    case 1:
      eventsArray.push( { title: toDo.name, start: date.toString().substring(0, 9), color: '#d9534f' } )
      break;
    case 2:
      eventsArray.push( { title: toDo.name, start: date.toString().substring(0, 9), color: '#428bca' } )
      break;
    case 3:
      eventsArray.push( { title: toDo.name, start: date.toString().substring(0, 9), color: '#428bca' } )
      break;
    case 4:
      eventsArray.push( { title: toDo.name, start: date.toString().substring(0, 9), color: '#d3d3d3' } )
      break;
  }
}

function removeFromList (eventsArray, index) {
  eventsArray.splice(index, 1);
}

function incrementDate(date) {
  var tomorrow = new Date(date);
  var dateValue = tomorrow.getDate() + 1;
  tomorrow.setDate(dateValue);
  return tomorrow;
}
