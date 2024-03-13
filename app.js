const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const tasksRouter = require("./routes/api/tasks");
const userRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/tasks", tasksRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found, app" });
});

app.use((err, req, res, next) => {
  // res.status(500).json({ message: err });
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
