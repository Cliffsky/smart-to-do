$(function () {

  /**
   * Count todos based on selector
   * @param {string} selector - jquery selector.
   */

  function countToDos(selector) {
    $('#todoControl').find('span').text($(selector).length);
  }

  /**
   * Toggle spinning gif
   * @param {boolean} visible - Show/Hide spinning gif.
   */
  function isLoading(visible) {

    if(visible) {
      $('#toDoList > img').show();
      $('#toDoList').find('li').remove();
    } else {
      $('#toDoList > img').hide();
    }
  }

  /**
   * Toggles 'true'/'false' status for toDo in database
   */
  function toggleComplete (id, elem) {
    if (elem.hasClass('notComplete')) {
      elem.removeClass('notComplete');
      elem.addClass('complete');
      elem.find('span').first().find('i').addClass('glyphicon-check');
      elem.find('span').first().find('i').removeClass('glyphicon-unchecked');
      $('#todoControl').find('a').last().click();
    } else {
      elem.removeClass('complete');
      elem.addClass('notComplete');
      elem.find('span').first().find('i').addClass('glyphicon-unchecked');
      elem.find('span').first().find('i').removeClass('glyphicon-check');
      $('#todoControl').find('a').first().next().click();
    }

    $.ajax({
      method: 'GET',
      url: 'api/todos/'+id+'/toggleComplete'
    }).done( function (result) {
      // done
    });
  }

  /**
   * Removes entry corresponding to argument Id in database
   * @param {integer} id - toDo id.
   * @param {item} object - HTML object
   */
  function deleteToDo (id, item) {
    $(item).remove();
    $('#todoControl').find('a').first().click();

    $.ajax({
      method: 'DELETE',
      url: '/api/todos/'+id
    }).done( function (result) {
      //
    });
  }

  /**
   * Show toDo list for logged user
   */
  function loadToDos() {

    // show loading page
    isLoading(true);

    $.ajax({
      method: 'GET',
      url: '/api/todos'
    }).done( function(todos) {

      // hide loading page
      isLoading(false);

      todos.forEach( function(todo){
        var categoryClass;

        switch(todo.category_id) {
          case 1: categoryClass = "list-group-item-danger";  break;
          case 2: categoryClass = "list-group-item-info";    break;
          case 3: categoryClass = "list-group-item-success"; break;
          case 4: categoryClass = "list-group-item-warning"; break;
        }

        var classIsComplete = todo.isComplete ? 'complete'  : 'notComplete';
        var iconIsComplete  = todo.isComplete ? 'check'     : 'unchecked';

        var checkmarkIcon = $('<span class="badge"><i class="glyphicon glyphicon-' + iconIsComplete + '"></i></span>');
        var deleteIcon = $('<span class="badge"><i class="glyphicon glyphicon-trash"></i></span></span>');

        var item  = $('<li>').text(todo.order + '. ' + todo.name);
        item.addClass('list-group-item');
        item.addClass(categoryClass);
        item.addClass(classIsComplete);

        var div   = $('<div>');

        // Bind onClick event
        $(checkmarkIcon).on('click', function() {
          toggleComplete(todo.id, item);
        })

        $(deleteIcon).on('click', function() {
          if( confirm('Are you sure?')){
            deleteToDo(todo.id, item);
          }
        });

        // Putting elements togheter
        checkmarkIcon.appendTo(div);
        deleteIcon.appendTo(div);
        div.appendTo(item);
        item.appendTo('#todoList');
        $('#toDoList').append(item);
      });

      // Count all todos
      countToDos('.notComplete, .complete');
    });
  }

  /**
   * Add a todo into list
   * @param {object} todo - toDo paramters
   */

  function addTodo(todo) {
    $.ajax({
      method: 'POST',
      url: '/api/todos',
      data: {
        category_id: todo.category_id,
        name: todo.name
      }
    }).done((response) => {
      if (response.rowCount) {
        flashMessage('#modalflashMessage', 'Item added to list', true);
        //refresh toDos after inserting
        loadToDos();
      } else {
        flashMessage('#modalflashMessage', 'Occurred an error while adding Item to list, try again later ', false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Filtering todos by isComplete

  $('#todoControl').find('a').on('click', function(elem) {
    var hide = $(this).data('hide');
    var show = $(this).data('show');

    $(this).parent().find('a').removeClass('label-default')
    $(this).addClass('label-default');

    $(hide).hide();
    $(show).show();
    //
    countToDos(show);
  });

  // --------------------------------------------------------------------------
  // Add toDo inside modal

  $('.carousel-inner').parent().find('button').on('click', function() {
    var todo = {};
    todo.category_id  = $(this).parent().find('.active > a').attr('data-category');
    todo.name         = $(this).parent().find('.active > a').attr('data-name')
    addTodo(todo);
  });

  $('#customList').find('button').on('click', function(elem) {
    var todo = {};
    todo.name         = $('.searchInput').val();
    todo.category_id  = $(elem.target).parent().find('select').val();
    addTodo(todo);
  })

  // --------------------------------------------------------------------------
  // When DOM Ready
  loadToDos();
});
