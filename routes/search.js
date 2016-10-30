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

    request({
      uri: placesUrl,
      method: "GET",
      timeout: 10000
    }, function(error, response, body) {
      if(error) throw new Error(error);

      const place  = JSON.parse(body).result;

      // Request first place photo to google
      let photoUrl;
      if (place.photos) {
        const photo_reference = place.photos[0].photo_reference;
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=120&photoreference=${photo_reference}&key=${GOOGLE_KEY}`;
      } else {
        photoUrl = 'http://epicaestate.com/includes/tng/styles/img_not_found.gif';
      }

      let str  = `${place.name} (${place.formatted_address})`;

      let data = [{
        name: str,
        id: false,
        img: photoUrl,
        length: '120',
        category: 2
      }];

      res.json(data);
    });
  });

  // --------------------------------------------------------------------------
  // Places
  // --------------------------------------------------------------------------
  // Find One
  // --------------------------------------------------------------------------




  // --------------------------------------------------------------------------
  // Movies
  // --------------------------------------------------------------------------
  // Find All
  // --------------------------------------------------------------------------

  router.get("/movies", (req, res) => {
    let html;

    const searchQuery   = req.query.search;
    const moviesUrl     = `http://www.omdbapi.com/?s=${searchQuery}`;
    var data =[];

    request({
      uri: moviesUrl,
      method: "GET",
      timeout: 10000
    }, function(error, response, body) {
      if(error) {
        res.json('');
        return;
      }
      var data = [];
      if (JSON.parse(body).Search) {
        data = JSON.parse(body).Search.map((element) => {
          return { name: element.Title + ' (' + element.Year + ')',
                   id: element.imdbID,
                   img: element.Poster,
                   category: 1
                 };
               });
      }
      res.send(data);
  });
});

  // --------------------------------------------------------------------------
  // Movies
  // --------------------------------------------------------------------------
  // Find One
  // --------------------------------------------------------------------------

  router.get("/movies/:id", (req, res) => {
    const moviesUrl = `http://www.omdbapi.com/?i=${req.params.id}`;

    request({
      uri: moviesUrl,
      method: "GET",
      timeout: 10000
    }, function(error, response, body) {
      let movie = JSON.parse(body);
      let data = {
        name: movie.Title,
        id: movie.imdbID,
        img: movie.Poster,
        year: movie.Year,
        length: movie.Runtime,
        dir: movie.Director,
        genre: movie.Genre,
        desc: movie.Plot,
        category: 1
      };
      res.send(data);
    });
  });

  // --------------------------------------------------------------------------
  // Products
  // --------------------------------------------------------------------------
  // Find Many
  // --------------------------------------------------------------------------

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
      let data = xml.tag('ItemSearchResponse').tag('Items').tag('Item').findMany();
      res.json(data);
    });
  });

  // --------------------------------------------------------------------------
  // Products
  // --------------------------------------------------------------------------
  // Fine one
  // --------------------------------------------------------------------------

  router.get("/products/:id", (req, res) => {
    let products;

    let endpoint = "webservices.amazon.com";
    let uri = "/onca/xml";

    let amazon_crazy_params = {
        "Service" : "AWSECommerceService",
        "Operation" : "ItemSearch",
        "AWSAccessKeyId" : AMAZON_KEY_ID,
        "AssociateTag" : ASSOCIATE_ID,
        "SearchIndex" : "All",
        "Keywords" : req.params.id,
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
      let data = xml.tag('ItemSearchResponse').tag('Items').tag('Item').findOne();
      res.json(data[0]);
    });
  });

  // --------------------------------------------------------------------------
  // Books
  // --------------------------------------------------------------------------
  // Find Many
  // --------------------------------------------------------------------------

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
      let results = JSON.parse(response.body);
      let data = [];
      if (results.items) {
        let max = results.items.length <= 10 ? (results.items.length - 1) : 9;
        data = results.items.slice(0, max).map((book) => {
          let thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : false;
          let title = book.volumeInfo.title ? book.volumeInfo.title : false
          let author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : false;
          let id = book.volumeInfo.industryIdentifiers ? book.volumeInfo.industryIdentifiers[0].identifier : false;
          return  {
                    name:  title + ' by ' + author,
                    id: id,
                    img: thumbnail,
                    length: `${Math.round(Number(book.volumeInfo.pageCount * 1.2))}`,
                    category: 3
                  };
        });
      }
      res.json(data);
    });
  });

  // ------------------------------------------------------------------------
  // Books
  // -------------------------------------------------------------------------
  // Find One
  // -------------------------------------------------------------------------

  router.get("/books/:id", (req, res) => {
    const booksUrl = `https://www.googleapis.com/books/v1/volumes?q=${req.params.id}&key=${GOOGLE_KEY}`

    request({
      url: booksUrl,
      method: "GET",
      timeout: 10000
    }, function(err, response, body) {
      if (err) throw new Error(err);
      let results = JSON.parse(response.body);
      let data;
      if (results.items) {
        let book = results.items[0].volumeInfo
        let thumbnail = book.imageLinks ? book.imageLinks.thumbnail : false;
        data = {
          name : book.title,
          authors : book.authors,
          id : book.industryIdentifiers[0].identifier,
          img : thumbnail,
          length: `${Math.round(book.pageCount * 1.2)}`,
          pagecount : book.pageCount,
          publisher : book.publisher,
          description : book.description
        }
      }
      res.json(data);
    });
  });
  return router;
}

