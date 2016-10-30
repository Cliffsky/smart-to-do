$(function(){

  // --------------------------------------------------------------------------
  // Load objects into calendar.


var toDoList = [{"id":119,"user_id":15,"category_id":1,"name":"All That Jazz (1979)","content":null,"length":123,"order":1,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":121,"user_id":15,"category_id":4,"name":"Jazz: A Film By Ken Burns","content":null,"length":20,"order":3,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":122,"user_id":15,"category_id":1,"name":"All That Jazz (1979)","content":null,"length":123,"order":4,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":123,"user_id":15,"category_id":2,"name":"Blue Martini Jazz Cafe (1516 Yew St, Vancouver, BC V6K 3E4, Canada)","content":null,"length":120,"order":5,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":124,"user_id":15,"category_id":4,"name":"Jazz: A Film By Ken Burns","content":null,"length":20,"order":6,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":128,"user_id":15,"category_id":1,"name":"Terminator 2: Judgment Day (1991)","content":null,"length":137,"order":7,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":129,"user_id":15,"category_id":1,"name":"The Terminator (1984)","content":null,"length":107,"order":8,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":130,"user_id":15,"category_id":3,"name":"Rick & Morty Vol. 2 by Zac Gorman","content":null,"length":154,"order":9,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":131,"user_id":15,"category_id":3,"name":"Rick & Morty Vol. 2 by Zac Gorman","content":null,"length":154,"order":10,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":132,"user_id":15,"category_id":1,"name":"The Good German (2006)","content":null,"length":105,"order":11,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-23T00:00:00.000Z","updated_at":null},
{"id":133,"user_id":15,"category_id":3,"name":"Ana's Girls by Eda R. Uca","content":null,"length":283,"order":12,"isComplete":false,"starting_at":"2016-10-23T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":134,"user_id":15,"category_id":3,"name":"The Secret History of Twin Peaks by Mark Frost","content":null,"length":365,"order":13,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":139,"user_id":15,"category_id":1,"name":"Jerry Seinfeld: 'I'm Telling You for the Last Time' (1998)","content":null,"length":75,"order":14,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":140,"user_id":15,"category_id":2,"name":"One More Sushi. (2155 Allison Rd #222, Vancouver, BC V6T 1T5, Canada)","content":null,"length":120,"order":15,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":141,"user_id":15,"category_id":2,"name":"McDonald's (5728 University Blvd #101, Vancouver, BC V6T 1K6, Canada)","content":null,"length":120,"order":16,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null},
{"id":142,"user_id":15,"category_id":2,"name":"Wendy's (3880 Grant McConachie Way, Vancouver Instation Airport, Intl Term, Richmond, BC V7B 0A5, Canada)","content":null,"length":120,"order":17,"isComplete":false,"starting_at":"2016-10-30T00:00:00.000Z","created_at":"2016-10-30T00:00:00.000Z","updated_at":null}];


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
      defaultDate: (new Date()).toISOString().substring(0, 10),
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: calendarHelper(toDoList)
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
  var date = new Date (eventsArray.sort((a, b) => (new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime()))[0].starting_at);
  console.log(date);
  var timeLeft = (date.getDay() === 0 || date.getDay() === 6) ? We : Wd; // Initialize leisure time.
  var category_id = [false, false, false, false]; // Array to check if you've done one of a category_idegory in a day;
  var events = []; // Initialize output array.
  var toDos = eventsArray.sort((a, b) => a.priority - b.priority); // Sort input array by order of priority.
  while (toDos.length > 0) {
    for (var i = 0; i < toDos.length; i += 1) {
      if (new Date(toDos[i].starting_at) <= date) {
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

function cleanUpEvents(eventsArray) {

}

});
