$(function(){

  // --------------------------------------------------------------------------
  // Load objects into calendar.

var today = new Date();
today = setDate()

function populateCalendar() {
  $.ajax({
    method: 'GET',
    url: '/api/todos'
  }).done( function (todos) {
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay,listWeek'
      },
      defaultDate: today,
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: calendarHelper(todos)
    });
  });
}

populateCalendar();

const Ea = 120;
const Bu = 20;
const Wt = 0;
const Rd = 60
const Wd = 180
const We = 360


function calendarHelper (eventsArray) {
  var date = new Date(); // Gets today's date.
  var timeLeft = (date.getDay() === 0 || date.getDay() === 6) ? We : Wd; // Initialize leisure time.
  var category_id = [false, false, false, false]; // Array to check if you've done one of a category_idegory in a day;
  var events = []; // Initialize output array.
  var toDos = eventsArray.sort((a, b) => a.priority - b.priority); // Sort input array by order of priority.
  while (toDos.length > 0) {
    for (var i = 0; i < toDos.length; i += 1) {
      if (category_id[toDos[i].category_id - 1] === false) {
        if (toDos[i].category_id === 3) {
          if (toDos[i].length > timeLeft && timeLeft > Rd) {
            timeLeft -= Rd;
            toDos[i].length = toDos[i].length - Rd;
            category_id[toDos[i].category_id - 1] = true;
            insertToDo(events, date, toDos[i]);
          } else if (timeLeft >= toDos[i].length) {
            timeLeft -= toDos[i].length;
            insertToDo(events, date, toDos[i]);
            category_id[toDos[i].category_id - 1] = true;
            removeFromList(toDos, i);
          }
        } else {
          if (timeLeft >= toDos[i].length) {
            timeLeft -= toDos[i].length;
            insertToDo(events, date, toDos[i]);
            category_id[toDos[i].category_id - 1] = true;
            removeFromList(toDos, i);
          }
        }
        if (timeLeft === 0) {
          break;
        }
      }
    }
    date = incrementDate(date);
    category_id = category_id.map(function (e) {
      return false;
    });
    timeLeft = (date.getDay() === 0 || date.getDay() === 6) ? We : Wd;
  }
  return events;
}

function insertToDo (eventsArray, date, toDo) {
  switch(toDo.category_id) {
    case 1:
      eventsArray.push( { title: toDo.name, start: date.toISOString().substring(0, 10), color: '#d9534f' } )
      break;
    case 2:
      eventsArray.push( { title: toDo.name, start: date.toISOString().substring(0, 10), color: '#428bca' } )
      break;
    case 3:
      eventsArray.push( { title: toDo.name, start: date.toISOString().substring(0, 10), color: '#428bca' } )
      break;
    case 4:
      eventsArray.push( { title: toDo.name, start: date.toISOString().substring(0, 10), color: '#d3d3d3' } )
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

});