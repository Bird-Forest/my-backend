const { Contact } = require("../models/contact");

const { HttpError } = require("../helper");

const { ctrlWrapper } = require("../middleware");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = true } = req.query;
  const filter = favorite === null ? { owner } : { favorite, owner };
  const skip = (page - 1) * limit;
  const result = await Contact.find({ filter }, "-createdAt -updatedAt", {
    skip,
    limit,
    favorite,
  }).populate("owner", "email subscription");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};

// const listContacts = async (req, res) => {
//   const { _id: owner } = req.user;
//   const { page = 1, limit = 20, favorite } = req.query;
//   const filter = favorite === null ? { owner } : { favorite, owner };
//   const skip = (page - 1) * limit;
//   const result = await Contact.find({owner}, "-createdAt -updatedAt", {
//     skip,
//     limit,
//   }).populate("owner", " email subscription");
//   res.json(result);
// };

// const listContacts = async (req, res) => {
//   const result = await Contact.find();
//   res.json(result);
// };
// const listContacts = async (req, res) => {
//   const { page = 1, limit = 3, favorite = true } = req.query;

//   const skip = (page - 1) * limit;
//   const result = await Contact.find(
//     { favorite, skip, limit },
//     "-createdAt -updatedAt"
//   );
//   res.json(result);
// };
