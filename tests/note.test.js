const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");
const helper = require("./test_helper");

const api = supertest(app);


beforeEach(async () => {
  await Note.deleteMany({});

  for (let index = 0; index < helper.initialNotes.length; index += 1) {
    await new Note(helper.initialNotes[index]).save();
  }
});


test("notes are returned as json", async () => {
  await api.get("/api/notes")
           .expect(200)
           .expect("Content-Type", /application\/json/);
});


test("there are two notes", async () => {
  const response = await api.get("/api/notes");

  expect(response.body).toHaveLength(helper.initialNotes.length);
});


test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");

  expect(response.body[0].content).toBe("HTML is easy");
});


test("a specific notes is among the returned notes", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map(note => note.content);
  expect(contents).toContain("Browser can execute only Javascript");
});


test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api.post("/api/notes")
           .send(newNote)
           .expect(200)
           .expect("Content-Type", /application\/json/);

  const notesInDB = await helper.getNotesInDB();
  expect(notesInDB).toHaveLength(helper.initialNotes.length + 1);

  const contents = notesInDB.map(note => note.content);

  expect(contents).toContain(
    "async/await simplifies making async calls"
  );
});


test("note without content is not added", async () => {
  const newNote = {
    important: true
  };

  await api.post("/api/notes")
           .send(newNote)
           .expect(400);

  const notesInDB = await helper.getNotesInDB();
  expect(notesInDB).toHaveLength(helper.initialNotes.length);
});


test("a specific note can be viewed", async () => {
  const notesInDB = await helper.getNotesInDB();

  const noteToView = notesInDB[0];

  const resultNote = await api.get(`/api/notes/${noteToView.id}`)
                              .expect(200)
                              .expect("Content-Type", /application\/json/);

  const parsedNote = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(parsedNote);
});


test("a note can be deleted", async () => {
  const noteToDelete = await helper.getFirstNote();

  await api.delete(`/api/notes/${noteToDelete.id}`)
      .expect(204);

  const remainingNotes = await helper.getNotesInDB();

  expect(remainingNotes).toHaveLength(helper.initialNotes.length - 1);
});

afterAll(() => {
  mongoose.connection.close();
});