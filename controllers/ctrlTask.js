const { Task } = require("../models/task");

const { HttpError } = require("../helper");

const { ctrlWrapper } = require("../middleware");

const listTasks = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Task.find({ owner }, "-createdAt -updatedAt");
  res.json(result);
};

const addTask = async (req, res) => {
  // console.log(req.params);
  const { _id: owner } = req.user;
  const result = await Task.create({ ...req.body, owner });
  // const result = await Task.create({ ...req.body });
  res.status(201).json(result);
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  console.log("_id", taskId);
  const result = await Task.findByIdAndDelete(taskId);
  console.log("result", result);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

// const updateTask = async (req, res) => {
//   const { taskId } = req.params;
//   const result = await Task.findByIdAndUpdate(taskId, req.body, {
//     new: true,
//   });
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json(result);
// };

const updateColorTask = async (req, res) => {
  const { taskId } = req.params;
  console.log(taskId);
  const result = await Task.findByIdAndUpdate(taskId, req.body);
  console.log(result);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

// const updateStatusTask = async (req, res) => {
//   const { taskId } = req.params;
//   const result = await Task.findByIdAndUpdate(taskId, req.body);
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json(result);
// };

module.exports = {
  listTasks: ctrlWrapper(listTasks),
  addTask: ctrlWrapper(addTask),
  deleteTask: ctrlWrapper(deleteTask),
  // updateTask: ctrlWrapper(updateTask),
  updateColorTask: ctrlWrapper(updateColorTask),
  // updateStatusTask: ctrlWrapper(updateStatusTask),
};
