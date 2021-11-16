const Note = require("../models/note");


const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  }
];


async function getNonexisitingId() {
  const note = new Note({ content: "irrelevant", date: new Date() });

  await note.save();
  await note.remove();

  return note._id.toString();
}


async function getNotesInDb() {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
}


module.exports = {
  initialNotes, getNonexisitingId, getNotesInDb
};