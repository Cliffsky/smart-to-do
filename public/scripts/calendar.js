$(function(){

  // --------------------------------------------------------------------------
  // Load objects into calendar.

function populateCalendar() {
  $.ajax({
    method: 'GET',
    url: '/api/todos'
  }).done( function (todos) {
      let events = calendarHelper(todos);
      console.log(events);
  })
}



const Ea = 120;
const Bu = 20;
const Wt = 0;
const Rd = 60
const Wd = 180
const We = 360


function calendarHelper (eventsArray) {
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
  console.log("Reached")
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
