"use strict";

const express        = require('express');
const router         = express.Router();

const bcrypt         = require("bcrypt");


module.exports = (knex) => {


// Login route


  router.post("/login", (req, res) => {
    knex
      .select("*")
      .from("users")
      .where('name', req.body.username)
      .then((results) => {
        if (results.length > 0) {
          bcrypt.compare(req.body.password, results[0].password_digest, function (err, response) {
            if (response) {
              req.session.user_id = results[0].id;
              res.send();
            } else {
              res.send("Invalid user credentials.");
            }
          });
        } else {
          res.send("Invalid user credentials.");
        }
    });
  });

// Logout

  router.delete("/login", (req, res) => {
    req.session.user_id = "";
    res.send();
  })

// Register

  router.post("/", (req, res) => {
    let user = req.body.username.toLowerCase();
    knex
        .select("name")
        .from("users")
        .where('name', user)
        .then((results) => {
          if(results.length === 0) {
            if (req.body.password === req.body.password_confirm) {
              bcrypt.hash(req.body.password, 10, function(err, hash) {
                knex('users').insert({
                  name: user,
                  password_digest: hash
                }).then(function (result) {
                  if(result.rowCount === '1') {
                    res.redirect("/../..")
                  }
                }).catch((err) => console.log(err));
              });
            } else {
              res.status('400');
            }
          } else {
            res.status(400);
            res.send("Invalid request. Name registered to another user.");
          }
        })
  });

  return router;

}
