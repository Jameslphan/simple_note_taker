// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs')

// Helper method for generating unique ids
const uuid = require("./helper/uuid");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
      } else {
        res.json(JSON.parse(data));
      }
});
});

//POST 
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} Request received.`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
          writeErr
          ? console.error(writeErr)
          : console.info('Successfully updated reviews!')
        );
      }
   });
   const response = {
    status: 'success',
    body: newNote,
   };

   console.log(response);
   res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note')
  }
});

// HTML Routes
//GET
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//GET
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));