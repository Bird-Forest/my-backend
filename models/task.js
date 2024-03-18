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
});

const updateColorSchema = Joi.object({
  color: Joi.string()
    .valid(...colorList)
    .required(),
});

const schemas = {
  addSchema,
  updateColorSchema,
};

const Task = model("task", taskSchema);

module.exports = {
  Task,
  schemas,
};
