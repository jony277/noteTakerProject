const express = require('express');
const router = express.Router();
const { readFromFile, readAndAppend } = require('./');
const { v4: uuidv4 } = require('uuid');

// Route for retrieving all notes
router.get('/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Route for adding a new note
router.post('/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(), // Generate a unique ID using the uuid package
    };

    readAndAppend(newNote, './db/db.json')
      .then(() => res.json('Note added successfully 🚀'))
      .catch((err) => res.status(500).json(`Error in adding note: ${err}`));
  } else {
    res.status(400).json('Title and text are required fields.');
  }
});

module.exports = router;
