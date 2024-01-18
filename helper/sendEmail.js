const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = (process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0");

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "iryna.bird@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = {
    data,
    from: "iryna.bird@meta.ua",
  };
  transporter
    .sendMail(email)
    .then(() => console.log("Email send success"))
    .catch((error) => console.log("Error sendMail :", error.message));
  console.log("I am sendEmailMeta", email);
  return true;
};

module.exports = sendEmail;

// const email = {
//   to: "gevakok234@telvetto.com",
//   from: "iryna.bird@meta.ua",
//   subject: "Test email",
//   html: "<p><strong>Test email</strong> from localhost:3000</p>",
// };

// transport
//   .sendMail(email)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.message));

// const sendEmail = async (data) => {
//   const email = { ...data, from: "iryna.bird@meta.ua" };
//   console.log("I am sendEmailMeta", email);
//   await transporter.sendMail(email);
//   return true;
// };
