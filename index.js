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


function unknownEndpoint(_, res) {
  res.status(404).send({
    error: "Unknown endpoint"
  });
}

function errorHandler(err, _, res, next) {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(err);
}


app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(requestLogger);


app.get("/api/notes", (_, res) => {
  Note.find({}).then(notes => res.json(notes));
});


app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  })
  .catch(error => next(error));
});


app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error));
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


app.put("/api/notes/:id", (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => res.json(updatedNote))
    .catch(error => next(error));
});


app.use(unknownEndpoint);
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
});