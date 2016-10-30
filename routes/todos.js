"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  const user_id = 1;

  // --------------------------------------------------------------------------
  // Get all todos

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("todos")
      .where({user_id: req.session.user_id})
      .orderBy('order', 'asc')
      .then((results) => {
        res.json(results);
    });
  });

  // --------------------------------------------------------------------------
  // Get all todos by categories

  router.get("/categories/:category_id", (req, res) => {

    const category_id = req.params.category_id;

    knex
      .select("*")
      .from("todos")
      .where({
        id: req.session.user_id,
        category_id: category_id
      })
      .then((results) => {
        res.json(results);
    });
  });

  // --------------------------------------------------------------------------
  // Create todo

  router.post("/", (req, res) => {

    const today = new Date().toJSON().slice(0,10);
    const todo = req.body;

    // Select the max value of order then insert todo
    knex('todos')
    .max('order')
    .where({user_id: req.session.user_id,})
    .then((results) => {
      todo.nextOrder = results[0].max + 1;

      // Insert todo
      knex('todos')
        .insert({
          user_id: req.session.user_id,
          category_id: todo.category_id,
          name: todo.name,
          content: todo.content,
          length: todo.length,
          order: todo.nextOrder,
          isComplete: false,
          starting_at: today,
          created_at: today
        })
        .then((results) => {
          res.json(results);
        })
        .catch((err)=> res.json(err));
      })
    .catch((err)=> res.json(err));
  });

  // --------------------------------------------------------------------------
  // Set complete

  router.get("/:todo_id/toggleComplete", (req, res) => {

    const todo_id = req.params.todo_id;

    // Get the actual value of isCompleted
    knex
    .select("isComplete")
      .from("todos")
      .where(
        {
          id: todo_id,
          user_id: req.session.user_id,
        })
      .then((results) => {
        let currentStatus = Boolean(results[0].isComplete);

        // Toogle value in database
        knex('todos')
        .where(
          {
            id: todo_id,
            user_id: req.session.user_id,
          })
        .update({isComplete: !currentStatus})
        .then((results) => {
          res.json(results);
        })
        .catch((err)=> res.json(err));
    });

  });

  // --------------------------------------------------------------------------
  // Delete

  router.delete("/:todo_id", (req, res) => {

    const todo_id = req.params.todo_id;

    knex('todos')
    .where(
      {
        id: todo_id,
        user_id: req.session.user_id,
      })
    .delete()
    .then((results) => {
      res.json(results);
    })
    .catch((err)=> res.json(err));
  });

  // --------------------------------------------------------------------------
  // Re-order todos

  router.post("/reorder", (req, res) => {

    const newOrder = req.body.ids;
    let a = newOrder.toString().split(',');


    let updateQuery = '';
    a.forEach( (todo_id, order) => {
      if(todo_id) {

        knex('todos')
        .where(
          {
            id: todo_id,
            user_id: req.session.user_id,
          })
        .update({order: order})
        .then((results) => {
          //res.json(results);
        })
        .catch((err)=> res.json(err));
      }
    });

  });



  /*
    api/todos/postpone, post
    Set following day as starting date for all toDos.
    Trigger populate.


    api/todos/:id/order, put
    Connect to database, change toDo priority.
    Trigger populate.
  */

  return router;
}
