"use strict";

const express = require('express');
const router  = express.Router();
const watchApi = require('../public/scripts/watch-api')

module.exports = (knex) => {

  router.get("/", (req, res) => {
    req.query.q
  })

  return search;
}
