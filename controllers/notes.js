const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");


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
  const user = await User.findById(req.body.userId);

  console.log("\n== user ==\n", user, "\n");

  const note = new Note({
    content: req.body.content ? req.body.content.trim() : null,
    important: req.body.important || false,
    date: new Date(),
    user: user._id
  });

  console.log("\n== note ==\n", note, "\n");

  const savedNote = await note.save();

  user.notes = user.notes.concat(savedNote._id);
  await user.save();

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