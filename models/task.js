const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helper");

const colorList = ["#ffffff", "#64b5f6", "#ff5252", "#ffee58", "#00e676"];

const taskSchema = new Schema(
  {
    title: {
      type: String,
      requied: [true, "Set task"],
    },
    color: {
      type: String,
      enum: colorList,
      default: "#ffffff",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      requied: true,
    },
  },
  { versionKey: false, timestamps: true }
);
// !!! ref - "user" - це посилання на колекцію, з якої буде { _id: owner}
taskSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  title: Joi.string().required(),
  color: Joi.string(),
  // completed: Joi.boolean().required(),
});

// const updateCompletedSchema = Joi.object({
//   completed: Joi.boolean().required(),
// });

const updateColorSchema = Joi.object({
  color: Joi.string().required(),
});

const schemas = {
  addSchema,
  // updateCompletedSchema,
  updateColorSchema,
};

const Task = model("task", taskSchema);

module.exports = {
  Task,
  schemas,
};
