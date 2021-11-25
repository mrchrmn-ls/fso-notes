const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("express-async-errors");
const app = express();

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const log = require("./utils/log");

const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

if (process.env.NODE_ENV === "test") {
  const testsRouter = require("./controllers/tests");
  app.use("/api/tests", testsRouter);
}

mongoose.connect(config.MONGODB_URL)
  .then(() => {
    log.info("connected to MongoDB");
  })
  .catch((error) => {
    log.error("error connecting to MongoDB:", error.message);
  });


app.use(cors());
app.use(express.static("build"));
app.use(express.json());

app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;