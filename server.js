const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuidHelper');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route for the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Route for retrieving all notes
app.get('/public/notes', (req, res) => {
  readFromFile('./Develop/db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Route for creating a new note
app.post('/public/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './Develop/db/db.json').then(() => {
      res.json('Note added successfully 🚀');
    });
  } else {
    res.status(400).json('Title and text are required.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
