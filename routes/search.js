"use strict";

require('dotenv').config({path: '../'});
const express       = require('express');
const router        = express.Router();
const request       = require('request');
const GOOGLE_KEY    = process.env.GOOGLE_KEY || "google_api";

module.exports = (knex) => {

  // --------------------------------------------------------------------------
  // Places

  router.get("/places", (req, res) => {

    let html;
    const searchQuery   = req.query.search;
    const placesUrl      = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${searchQuery}&key=${GOOGLE_KEY}`;

    // ------------------------------------------------------------------------
    // Google Place search

    // Image URL
    //https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CoQBdwAAAOSYpSqbAajywHPb1Pob4BXo_v2Vomw6HFdOfywm7usd9098xAKxSlrtnb5KIf-AKh0c51vRblIABK0LCpa5uIQuV7NeeAIXcuT6YHIxoSRWtdqz05XGJuOo4fJKTiHX8V4_pzj_gt1PLTcw5cT52P1frQ2Q_hz6ETHgihVDchTXEhCb29eMz8gBS4-42YbvYCF5GhSlFLB8qvvv2cyUSWSAD1NiZ8B_mw&key=AIzaSyDhSBa8z_IXeQx_jeoR26TAxWxDeK_RpNE

    request({
      uri: placesUrl,
      method: "GET",
      timeout: 10000
    }, function(error, response, body) {
      if(error) throw new Error(error);

      const place  = JSON.parse(body).result;

      // Creating HTML for a place
      html  = '<p> ' + place.name + ' </p>';
      html += '<p> ' + place.formatted_address +' </p>';
      html += '<p> ' + place.formatted_phone_number +' </p>';

      res.send(html);
    });
  });

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------




  // --------------------------------------------------------------------------
  // Movies

  router.get("/movies", (req, res) => {
    let html;

    const searchQuery   = req.query.search;
    const moviesUrl     = `http://www.omdbapi.com/?s=${searchQuery}`;

    request({
      uri: moviesUrl,
      method: "GET",
      timeout: 10000
    }, function(error, response, body) {
      if(error) throw new Error(error);

      res.json(JSON.parse(body));
    });
  });

  // --------------------------------------------------------------------------
  // Products

  router.get("/products", (req, res) => {
    let products;

    const searchQuery = req.query.search;
    const productsUrl =


  });

  // --------------------------------------------------------------------------
  // Books

  router.get("/books", (req, res) => {
    let books=[];
    const searchQuery = req.query.search;
    const booksUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${GOOGLE_KEY}`

    request({
      url: booksUrl,
      method: "GET",
      timeout: 10000
    }, function(err, response, body) {
      if (err) throw new Error(err);
      JSON.parse(response.body).items.slice(0,9).forEach((book) => {
        books.push({title: book.volumeInfo.title, authors: book.volumeInfo.authors, pageCount: book.volumeInfo.pageCount, thumbnail: book.volumeInfo.imageLinks.thumbnail});
      });
      res.send(books);
    });
  });

  return router;
}
