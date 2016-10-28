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
        console.log(todo);
        var categoryClass;

        switch(todo.category_id) {
          case 1: categoryClass = "watch";  break;
          case 2: categoryClass = "eat";    break;
          case 3: categoryClass = "read";   break;
          case 4: categoryClass = "buy";    break;
        }

        // Creating elements
        var item = $('<li>').text(todo.name).addClass('list-group-item').addClass(categoryClass);
        var deleteIcon = $('<span class="badge"><i class="glyphicon glyphicon-trash"></i></span>');

        // Bind onClick event
        $(deleteIcon).on('click', function() {
          alert(todo.id);
        });

        // Putting elements togheter
        deleteIcon.appendTo(item);
        item.appendTo('#todoList');
        $('#toDoList').append(item)
      });
    });
  }

  // Load the All ToDos when loading page
  loadToDos();
});
