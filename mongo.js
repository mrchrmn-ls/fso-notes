const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument: node mongo.js <password>");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@fso1.lm0iv.mongodb.net/notes-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML is easy",
  date: new Date(),
  important: true
});

note.save().then(() => {
  console.log("note saved!");
  mongoose.connection.close();
});