import { USER } from "../models/user.js";

const allowedFields = Object.keys(USER).filter(key => key !== "id");

const isNotStr = (str) => typeof str !== "string";
const isNotGmail = (email) => isNotStr(email) || !email.endsWith("@gmail.com");
const isNotPhone = (phone) => isNotStr(phone) || !(/^\+380\d{9}$/.test(phone));
const isNotPassword = (password) => isNotStr(password) || password.length < 4;

const hasOnlyAllowedFields = (body) =>
    Object.keys(body).every(key => allowedFields.includes(key));

const createUserValid = (req, res, next) => {
  // TODO: Implement validatior for USER entity during creation

  const body = req.body;
  const { email, phone, password, firstName, lastName } = body;

  if ("id" in body) {
    res.err = { status: 400, message: "ID should not be present in request body" };
    return next();
  }

  if (!hasOnlyAllowedFields(body)) {
    res.err = { status: 400, message: "Request contains unexpected fields" };
    return next();
  }

  if (
      isNotStr(firstName) ||
      isNotStr(lastName) ||
      isNotGmail(email) ||
      isNotPhone(phone) ||
      isNotPassword(password)
  ) {
    res.err = { status: 400, message: "User entity to create isn’t valid" };
    return next();
  }

  next();
};

const updateUserValid = (req, res, next) => {
  // TODO: Implement validatior for user entity during update
  const body = req.body;

  if ("id" in body) {
    res.err = { status: 400, message: "ID should not be present in request body" };
    return next();
  }

  if (!hasOnlyAllowedFields(body)) {
    res.err = { status: 400, message: "Request contains unexpected fields" };
    return next();
  }

  if (Object.keys(body).length === 0) {
    res.err = { status: 400, message: "At least one field must be provided for update" };
    return next();
  }

  const validators = {
    firstName: isNotStr,
    lastName: isNotStr,
    email: isNotGmail,
    phone: isNotPhone,
    password: isNotPassword,
  };

  for (const key of Object.keys(body)) {
    const isNotValid = validators[key]?.(body[key]);
    if (isNotValid) {
      res.err = { status: 400, message: `Invalid value for field: ${key}` };
      return next();
    }
  }

  next();
};

export { createUserValid, updateUserValid };
