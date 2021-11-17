const log = require("./log");

function requestLogger(req, _, next) {
  log.info("Method:", req.method);
  log.info("Path:", req.path);
  log.info("Bdy:", req.body);
  log.info("---");
  next();
}

function unknownEndpoint(_, res) {
  res.status(404).send({
    error: "Unknown endpoint"
  });
}

function errorHandler(err, _, res, next) {
  log.info(err.message);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
    return null;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
    return null;
  }

  if (err.name === "JsonWebTokenError") {
    res.status(401).json(({ error: "invalid token" }));
    return null;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({ error: "token expired" });
    return null;
  }

  next(err);
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
};