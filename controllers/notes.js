const notesRouter = require("express").Router();
const Note = require("../models/note");


notesRouter.get("/", async (_, res) => {
  const notes = await Note.find({});
  res.json(notes);
});


notesRouter.get("/:id", async (req, res) => {
  let note = await Note.findById(req.params.id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});


notesRouter.delete("/:id", async (req, res) => {
  await Note.findByIdAndRemove(req.params.id);
  res.status(204).end();
});


notesRouter.post("/", async (req, res) => {
  const content = req.body.content ? req.body.content.trim() : null;

  const note = new Note({
    content,
    important: req.body.important || false,
    date: new Date()
  });

  const savedNote = await note.save();
  res.status(201).json(savedNote);
});


notesRouter.put("/:id", async (req, res) => {
  const note = {
    content: req.body.content,
    important: req.body.important
  };

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, { new: true });
  res.json(updatedNote);
});


module.exports = notesRouter;