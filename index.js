require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const Note = require("./models/note");


function requestLogger(req, _, next) {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Bdy:", req.body);
  console.log("---");
  next();
}


function unknownEndpoint(req, res) {
  res.status(404).send({
    error: "Unknown endpoint"
  });
}


app.use(express.static("build"));

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.get("/api/notes", (_, res) => {
  Note.find({}).then(notes => res.json(notes));
});


app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id).then(note => res.json(note));
});


app.delete("/api/notes/:id", (req, res) => {
});


app.post("/api/notes", (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({
      error: "content missing"
    });
  }

  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
    date: new Date()
  });

  note.save().then(savedNote => res.json(savedNote));
});


app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
});