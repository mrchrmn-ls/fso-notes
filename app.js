
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const config = require("./utils/config");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const log = require("./utils/log");

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

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;