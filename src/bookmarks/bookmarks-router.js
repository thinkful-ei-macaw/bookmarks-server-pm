const express = require('express');
const { uuid } = require('uuidv4');
const logger = require('../logger');
const { bookmarks } = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url } = req.body;

    let isValid = true;

    // check for required fields
    const requiredFields = ['title', 'url'];
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        isValid = false;
        return res.status(400).send(`${field} is required`);
      }
    });

    if (!isValid) return false;

    // creating bookmark obj
    const id = uuid();
    const bookmark = { id, title, url };

    // adding it to data
    bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${id} created`);

    // the response
    return res
      .status(201)
      .location(`http://localhost:8080/bookmarks/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bm => bm.id.toString() === id);
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bm => bm.id.toString() === id);
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send('Not found');
    }
    bookmarks.splice(bookmarkIndex, 1);
    logger.info(`Bookmark with id ${id}deleted.`);
    res.status(204).end();
  });

module.exports = bookmarksRouter;
