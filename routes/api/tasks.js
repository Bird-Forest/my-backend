const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/ctrlTask");

const { schemas } = require("../../models/task");

const { authenticate, validateBody, isValidId } = require("../../middleware");

// ****************
router.get("/", authenticate, ctrl.listTasks);

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.addTask);

router.delete("/:taskId", authenticate, isValidId, ctrl.deleteTask);

router.patch(
  "/:taskId/color",
  authenticate,
  isValidId,
  validateBody(schemas.updateColorSchema),
  ctrl.updateColorTask
);

// router.patch(
//   "/:taskId/completed",
//   authenticate,
//   isValidId,
//   validateBody(schemas.updateCompletedSchema),
//   ctrl.updateStatusTask
// );

// router.patch(
//   "/:taskId/color",
//   authenticate,
//   isValidId,
//   validateBody(schemas.updateColorSchema),
//   ctrl.updateColorTask
// );

module.exports = router;
