import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";

const router = Router();
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

// TODO: Implement route controllers for fighter
router.get("/",
    ctrlWrapper((req, res) => {
      res.data = fighterService.getAll();
    }),
    responseMiddleware);

router.get("/:id", ctrlWrapper((req, res) => {
    const fighter = fighterService.getById(req.params.id);

    if (!fighter) {
      res.err = { message: "Fighter not found." };
    }
    else {
      res.data = fighter;
    }
    }),
    responseMiddleware);


router.post("/", createFighterValid, ctrlWrapper((req, res, next) => {
    if (res.err) {
      return next();
    }
    res.data = fighterService.createFighter(req.body);
    }),
    responseMiddleware);

router.patch("/:id", updateFighterValid, ctrlWrapper((req, res, next) => {
    if (res.err) {
      return next();
    }
    const updated = fighterService.updateFighter(req.params.id, req.body);
    if (!updated) {
      res.err = { message: "Fighter not found." };
    }
    else {
      res.data = updated;
    }
    }),
    responseMiddleware);

router.delete("/:id", ctrlWrapper((req, res) => {
    const deleted = fighterService.deleteFighter(req.params.id);
    if (!deleted.length) {
      res.err = { message: "Fighter not found." };
    }
    else {
      res.data = {
        message: "Deleted",
      };
    }
    }),
    responseMiddleware);

export { router };
