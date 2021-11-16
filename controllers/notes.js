const notesRouter = require("express").Router();
const Note = require("../models/note");


notesRouter.get("/", async (_, res) => {
  const notes = await Note.find({});
  res.json(notes);
});


notesRouter.get("/:id", async (req, res, next) => {
  try {
    let note = Note.findById(req.params.id);

    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }

  } catch(error) {
    next(error);
  }
});


notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error));
});


notesRouter.post("/", (req, res, next) => {
  const content = req.body.content ? req.body.content.trim() : null;

  const note = new Note({
    content,
    important: req.body.important || false,
    date: new Date()
  });

  note.save()
    .then(savedNote => savedNote.toJSON())
    .then(formattedNote => res.json(formattedNote))
    .catch(error => next(error));
});


notesRouter.put("/:id", (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => res.json(updatedNote))
    .catch(error => next(error));
});


module.exports = notesRouter;