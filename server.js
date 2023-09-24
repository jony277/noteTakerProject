const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json('Note added successfully 🚀');
  } else {
    res.status(400).json('Title and text are required.');
  }
});

// Bonus: DELETE function
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const notesToKeep = parsedNotes.filter((note) => note.id !== noteId);

      fs.writeFile('./db/db.json', JSON.stringify(notesToKeep, null, 4), (writeErr) =>
        writeErr ? console.error(writeErr) : console.info('Note has been deleted!')
      );
    }
  });
  res.send('Note has been deleted!');
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
