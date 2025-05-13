import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = Router();

// TODO: Implement route controllers for user
router.get("/",  ctrlWrapper((req, res, _) => {
    res.data = userService.getAll();
    }), responseMiddleware);

router.get("/:id", ctrlWrapper((req, res, _) => {
    const user = userService.getOne({ id: req.params.id });
    if (!user) {
      res.err = { message: "User not found" };
    } else {
      res.data = user;
    }
    }), responseMiddleware);

router.post(
    "/",
    createUserValid,
    ctrlWrapper((req, res, next) => {
        if (res.err) {
          return next();
        }
        res.data = userService.create(req.body);
    }),
    responseMiddleware
);

router.patch(
    "/:id",
    updateUserValid,
    ctrlWrapper((req, res, next) => {
        if (res.err) {
          return next();
        }
        res.data = userService.update(req.params.id, req.body);
    }),
    responseMiddleware
);

router.delete("/:id", ctrlWrapper((req, res, next) => {
    const user = userService.delete(req.params.id);
    if (!user) {
      res.err = { message: "Nothing to delete. User not found" };
    } else {
      res.data = {
        message: "Deleted",
      };
    }
    }), responseMiddleware);

export { router };
