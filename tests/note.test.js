const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const Note = require("../models/note");
const helper = require("./test_helper");

const api = supertest(app);


beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(helper.initialNotes);
});


describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });


  test("creation succeeds with a fresh username", async () => {
    const initialList = await helper.getAllInDB(User);

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api.post("/api/users")
             .send(newUser)
             .expect(201)
             .expect("Content-Type", /application\/json/);

    const updatedList = await helper.getAllInDB(User);
    expect(updatedList).toHaveLength(initialList.length + 1);

    const usernames = updatedList.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });


  test("creation fails with proper statuscode and message if username already taken", async () => {
    const initialList = await helper.getAllInDB(User);

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const response = await api.post("/api/users")
                            .send(newUser)
                            .expect(400)
                            .expect("Content-Type", /application\/json/);

    expect(response.body.error).toContain("`username` to be unique");

    const updatedList = await helper.getAllInDB(User);
    expect(updatedList).toHaveLength(initialList.length);
  });
});


xdescribe("when there are some notes saved", () => {
  test("notes are returned as json", async () => {
    await api.get("/api/notes")
             .expect(200)
             .expect("Content-Type", /application\/json/);
  });


  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    expect(response.body).toHaveLength(helper.initialNotes.length);
  });


  test("a specific note is among the returned notes", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map(note => note.content);
    expect(contents).toContain("Browser can execute only Javascript");
  });


  describe("viewing a specific note", () => {
    test("succeeds with valid id", async () => {
      const notesInDB = await helper.getAllInDB(Note);

      const noteToView = notesInDB[0];

      const resultNote = await api.get(`/api/notes/${noteToView.id}`)
                                  .expect(200)
                                  .expect("Content-Type", /application\/json/);

      const parsedNote = JSON.parse(JSON.stringify(noteToView));

      expect(resultNote.body).toEqual(parsedNote);
    });


    test("fails with statuscode 404 if note does not exist", async () => {
      const validNonExistingId = await helper.getNonexisitingId();

      await api.get(`/api/notes/${validNonExistingId}`)
               .expect(404);
    });


    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "22489902bbnm322b";

      await api.get(`/api/notes/${invalidId}`)
               .expect(400);
    });
  });


  describe("addition of a new note", () => {
    test("succeeds with valid note", async () => {
      const newNote = {
        content: "async/await simplifies making async calls",
        important: true,
      };

      await api.post("/api/notes")
               .send(newNote)
               .expect(201)
               .expect("Content-Type", /application\/json/);

      const notesInDB = await helper.getAllInDB(Note);
      expect(notesInDB).toHaveLength(helper.initialNotes.length + 1);

      const contents = notesInDB.map(note => note.content);

      expect(contents).toContain(
        "async/await simplifies making async calls"
      );
    });


    test("fails with status code 400 if data is not valid", async () => {
      const newNote = {
        important: true
      };

      await api.post("/api/notes")
               .send(newNote)
               .expect(400);

      const notesInDB = await helper.getAllInDB(Note);
      expect(notesInDB).toHaveLength(helper.initialNotes.length);
    });
  });


  describe("deletion of a note", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const noteToDelete = await helper.getFirstItem(Note);

      await api.delete(`/api/notes/${noteToDelete.id}`)
               .expect(204);

      const remainingNotes = await helper.getAllInDB(Note);

      expect(remainingNotes).toHaveLength(helper.initialNotes.length - 1);
    });
  });
});


afterAll(() => {
  mongoose.connection.close();
});