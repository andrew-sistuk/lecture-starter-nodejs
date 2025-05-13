import { FIGHTER } from "../models/fighter.js";
import {fighterRepository} from "../repositories/fighterRepository.js";

const allowedKeys = Object.keys(FIGHTER).filter((key) => key !== "id");

const isNameTaken = (name, excludeId = null) => {
  const fighters = fighterRepository.getAll();
  return fighters.some((fighter) =>
      fighter.name.toLowerCase() === name.toLowerCase() &&
      fighter.id !== excludeId
  );
};

const validateFighterFields = (data) => {
  const errors = [];

  if (data.name && typeof data.name !== "string") {
    errors.push("Name must be a string.");
  }

  if (data.power != null) {
    if (typeof data.power !== "number" || data.power < 1 || data.power > 100) {
      errors.push("Power must be a number between 1 and 100.");
    }
  }

  if (data.defense != null) {
    if (typeof data.defense !== "number" || data.defense < 1 || data.defense > 10) {
      errors.push("Defense must be a number between 1 and 10.");
    }
  }

  if (data.health != null) {
    if (typeof data.health !== "number" || data.health < 80 || data.health > 120) {
      errors.push("Health must be a number between 80 and 120.");
    }
  }

  return errors;
};


const createFighterValid = (req, res, next) => {
  // TODO: Implement validatior for FIGHTER entity during creation
  const data = req.body;

  const incomingKeys = Object.keys(data);
  const invalidKeys = incomingKeys.filter((key) => !allowedKeys.includes(key));
  const missingKeys = allowedKeys.filter((key) => key !== "health" && data[key] == null);

  const errors = [];

  if (invalidKeys.length) {
    errors.push(`Invalid keys: ${invalidKeys.join(", ")}`);
  }

  if (missingKeys.length) {
    errors.push(`Missing required keys: ${missingKeys.join(", ")}`);
  }

  if (data.name && isNameTaken(data.name)) {
    errors.push("Fighter name already exists.");
  }

  errors.push(...validateFighterFields(data));

  if (errors.length > 0) {
     res.err = { message: errors.join(" ") };
    return next();
  }

  // встановлюємо health за замовчуванням
  if (!data.health) {
    req.body.health = 85;
  }

  next();
};

const updateFighterValid = (req, res, next) => {
  // TODO: Implement validatior for FIGHTER entity during update
  const data = req.body;
  const fighterId = req.params.id;

  const incomingKeys = Object.keys(data);
  const invalidKeys = incomingKeys.filter((key) => !allowedKeys.includes(key));

  const errors = [];

  if (incomingKeys.length === 0) {
    errors.push("At least one field must be provided.");
  }

  if (invalidKeys.length) {
    errors.push(`Invalid keys: ${invalidKeys.join(", ")}`);
  }

  if (data.name && isNameTaken(data.name, fighterId)) {
    errors.push("Fighter name already exists.");
  }

  errors.push(...validateFighterFields(data));

  if (errors.length > 0) {
    res.err = { message: errors.join(" ") };
  }
  next();
};

export { createFighterValid, updateFighterValid };
