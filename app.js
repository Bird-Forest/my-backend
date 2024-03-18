const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const fileupload = require("express-fileupload");

const tasksRouter = require("./routes/api/tasks");
const userRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use(fileupload({ createParentPath: true }));

app.use("/api/tasks", tasksRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found, app" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  console.log("END APP", message);
  console.log("END APP", err);
  res.status(status).json({ message });
});

module.exports = app;
