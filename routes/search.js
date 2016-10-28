"use strict";

// require('dotenv').config({path: '../'});
const express       = require('express');
const router        = express.Router();

const request       = require('request');
const crypto        = require('crypto');
const xmlHelper     = require('../tools/xmlHelper')
const xmlDom        = require('xmldom').DOMParser;
const GOOGLE_KEY    = process.env.GOOGLE_KEY || "google_api";
const AMAZON_KEY    = process.env.AMAZON_KEY || "amazon_api";
const AMAZON_KEY_ID = process.env.AMAZON_KEY_ID;
const ASSOCIATE_ID  = process.env.AMAZON_ASSOCIATE_ID;


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

    let endpoint = "webservices.amazon.com";
    let uri = "/onca/xml";

    let amazon_crazy_params = {
        "Service" : "AWSECommerceService",
        "Operation" : "ItemSearch",
        "AWSAccessKeyId" : AMAZON_KEY_ID,
        "AssociateTag" : ASSOCIATE_ID,
        "SearchIndex" : "All",
        "Keywords" : req.query.search,
        "ResponseGroup" : "Images,ItemAttributes,Offers",
        "Timestamp": (new Date()).toISOString()
    };

    let sortedKeys = Object.keys(amazon_crazy_params).sort();

    let queryString = sortedKeys.map((key) =>
      encodeURIComponent(key)+"="+encodeURIComponent(amazon_crazy_params[key])
    ).join('&');

    let sign_me = ['GET', endpoint, uri, queryString].join('\n');

    let signed_sealed_escaped = encodeURIComponent(crypto.createHmac('SHA256', AMAZON_KEY).update(sign_me).digest('base64'));
    let request_url = `http://${endpoint}${uri}?${queryString}&Signature=${signed_sealed_escaped}`;

    request({
      url: request_url,
      method: "GET",
      timeout: 10000
    }, function (err, response, body) {
      if (err) throw new Error(err);
      let doc = new xmlDom().parseFromString(body.substring(2, response.length));
      let xml = new xmlHelper(doc);
      let data = xml.tag('ItemSearchResponse').tag('Items').tag('Item').makeNickHappy();
      res.send(data);
    });
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

