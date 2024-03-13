const { Task } = require("../models/task");

const { HttpError } = require("../helper");

const { ctrlWrapper } = require("../middleware");

const listTasks = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Task.find({ owner }, "-createdAt -updatedAt");
  // **** find - 1парам - об'єкт пошуку, 2 - список полів які треба або не треба повертати, 3 - додаткові налаштування
  // const { page = 1, limit = 10 } = req.query;
  // const skip = (page - 1) * limit;
  // ** .populate("owner") - цей запис додасть до кожного завдання об'єкт юзера з полями, які ми вкажемо після , **
  // const result = await Task.find({ owner }, "-createdAt -updatedAt", {
  //   skip,
  //   limit,
  // }).populate("owner", "name email");

  res.json(result);
};

const listTasksByColor = async (req, res) => {
  const { _id: owner } = req.user;
  console.log("ByColor user", req.user);
  const { newColor } = req.params.color;
  console.log("ByColor query", req.params.color);
  // const result = await Task.find({ owner }, { color: newColor });
  const result = await Task.find(
    { owner },
    {
      color: newColor,
    },
    "-createdAt -updatedAt"
  );
  console.log("ByColor result", result);

  const priorTasks = result.filter((task) => task.color === newColor);

  console.log(priorTasks);

  res.json(priorTasks);
};

const addTask = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Task.create({ ...req.body, owner });
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

const updateColorTask = async (req, res) => {
  const { taskId } = req.params;
  const newColor = req.body.color;
  // console.log("id", taskId);
  // console.log("color", newColor);

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { color: newColor },
    { new: true } // Возвращать обновленный документ
  );
  console.log("upTask", updatedTask);

  if (!updatedTask) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedTask);
};

module.exports = {
  listTasks: ctrlWrapper(listTasks),
  addTask: ctrlWrapper(addTask),
  deleteTask: ctrlWrapper(deleteTask),
  updateColorTask: ctrlWrapper(updateColorTask),
  listTasksByColor: ctrlWrapper(listTasksByColor),
};
