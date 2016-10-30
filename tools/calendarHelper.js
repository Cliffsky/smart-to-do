var toDoList = [
  {
    name: 'Terminator 2',
    priority: 1,
    length: 137,
    qty: 1,
    cat: 1,
  },
  {
    name: 'Rick and Morty',
    priority: 8,
    length: 22,
    qty: 5,
    cat: 1,
  },
  {
    name: 'Anna Karenina',
    priority: 3,
    length: 1036,
    qty: 1,
    cat: 3,
  },
  {
    name: 'Bay Sushi',
    priority: 4,
    length: 120,
    qty: 1,
    cat: 2,
  },
  {
    name: 'Batteries',
    priority: 2,
    length: 20,
    qty: 1,
    cat: 4,
  },
  {
    name: 'The Wise Hall',
    priority: 7,
    length: 120,
    qty: 1,
    cat: 2,
  },
  {
    name: 'Beer',
    priority: 3,
    length: 20,
    qty: 1,
    cat: 4,
  },
  {
    name: 'The Age of Revolution',
    priority: 6,
    length: 499,
    qty: 1,
    cat: 3,
  },
  {
    name: 'Weapons of Math Destruction',
    priority: 9,
    length: 326,
    qty: 1,
    cat: 3,
  },
  {
    name: 'Black Lodge',
    priority: 5,
    length: 120,
    qty: 1,
    cat: 2,
  },
  {
    name: 'Laptop',
    priority: 10,
    length: 20,
    qty: 1,
    cat: 4
  }
]

const Ea = 120;
const Bu = 20;
const Wt = 0;
const Rd = 60
const Wd = 180
const We = 360


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

console.log(populateCalendar(toDoList));

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
