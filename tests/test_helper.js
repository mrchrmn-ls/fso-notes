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


async function getAllInDB(model) {
  const list = await model.find({});
  return list.map(item => item.toJSON());
}


async function getFirstItem(model) {
  const parsedList = await getAllInDB(model);
  return parsedList[0];
}


module.exports = {
  initialNotes, getNonexisitingId, getAllInDB, getFirstItem
};