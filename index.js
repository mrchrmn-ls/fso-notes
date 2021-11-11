const express = require("express");
const app = express();

app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
];


app.get("/", (_, res) => {
  res.send("<h1>Hello, World!</h1>");
});


app.get("/api/notes", (_, res) => {
  res.json(notes);
});


app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});


app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);

  res.status(204).end();
});


function generateId(notes) {
  const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
  return maxId +1;
}


app.post("/api/notes", (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({
      error: "content field missing"
    });
  }

  const note = {
    id: generateId(notes),
    content: req.body.content,
    important: req.body.content || false,
    date: new Date().toISOString()
  } 

  notes = notes.concat(note);
  res.json(note);
});


const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);