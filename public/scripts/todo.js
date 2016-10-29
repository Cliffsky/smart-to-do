$(() => {
  /**
   * Show toDo list for logged user
   */
  function loadToDos() {

    $.ajax({
      method: 'GET',
      url: '/api/todos'
    }).done( function(todos) {
      todos.forEach( function(todo){
        var categoryClass;

        switch(todo.category_id) {
          case 1: categoryClass = "watch";  break;
          case 2: categoryClass = "eat";    break;
          case 3: categoryClass = "read";   break;
          case 4: categoryClass = "buy";    break;
        }

        // Refactor!!
        var classComplete = todo.isComplete ? 'todoComplete' : 'todoNotComplete';

        // Creating elements
        var item = $('<li>').text(todo.name).addClass('list-group-item').addClass(categoryClass).addClass(classComplete);
        var deleteIcon = $('<span class="badge"><i class="glyphicon glyphicon-trash"></i></span>');
        var checkmarkIcon = $('<span class="badge"><i class="glyphicon glyphicon-ok"></i></span>');

        // Bind onClick event
        $(deleteIcon).on('click', function() {
          if( confirm('Are you sure?')){
            deleteToDo(todo.id, item);
          }
        });

        $(checkmarkIcon).on('click', function() {
          toggleComplete(todo.id);
          var notComplete = $(this).parent().hasClass('todoNotComplete');

          if(notComplete) {
            $(this).parent().addClass('todoComplete')
            $(this).parent().removeClass('todoNotComplete')
          } else {
            $(this).parent().removeClass('todoComplete')
            $(this).parent().addClass('todoNotComplete')
          }

          // Show again to-dos
          $('#showNotComplete').click();
        })

        // Putting elements togheter
        deleteIcon.appendTo(item);
        checkmarkIcon.appendTo(item);
        item.appendTo('#todoList');
        $('#toDoList').append(item)
      });
    });
  }

  function deleteToDo (id, item) {
    // Removes entry corresponding to argument Id in database
    $.ajax({
      method: 'DELETE',
      url: '/api/todos/'+id
    }).done( function (result) {
      // Updates index.html to remove list item
    $(item).remove();
    })
  }

  function toggleComplete (id) {
    // Toggles 'true'/'false' status for toDo in database
    $.ajax({
      method: 'GET',
      url: 'api/todos/'+id+'/toggleComplete'
    }).done( function (result) {

    })
  }

  $('#showComplete').on('click', function(e) {
    $('.todoNotComplete').css('display', 'none');
    $('.todoComplete').css('display', 'block');
  });

  $('#showNotComplete').on('click', function(e) {
    $('.todoNotComplete').css('display', 'block');
    $('.todoComplete').css('display', 'none');
  });


  $('#showAll').on('click', function(e) {
    $('.todoNotComplete').css('display', 'block');
    $('.todoComplete').css('display', 'block');

  });

  // Load the All ToDos when loading page
  loadToDos();
});
