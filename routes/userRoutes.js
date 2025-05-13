import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

// TODO: Implement route controllers for user
router.get("/", async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.data = users;
  } catch (err) {
    res.err = err;
  } finally {
    next();
  }
}, responseMiddleware);

router.get("/:id", (req, res, next) => {
  try {
    const user = userService.getOne({ id: req.params.id });
    if (!user) {
      res.err = { message: "User not found" };
    } else {
      res.data = user;
    }
  } catch (err) {
    res.err = err;
  } finally {
    next();
  }
}, responseMiddleware);

router.post(
    "/",
    createUserValid,
    (req, res, next) => {
      try {
        if (res.err) {
          return next();
        }
        const createdUser = userService.create(req.body);
        res.data = createdUser;
      } catch (err) {
        res.err = err;
      } finally {
        next();
      }
    },
    responseMiddleware
);

router.patch(
    "/:id",
    updateUserValid,
    (req, res, next) => {
      try {
        if (res.err) {
          return next();
        }
        const updatedUser = userService.update(req.params.id, req.body);

        res.data = updatedUser;
      } catch (err) {
        res.err = err;
      } finally {
        next();
      }
    },
    responseMiddleware
);

router.delete("/:id", (req, res, next) => {
  try {
    const user = userService.delete(req.params.id);
    if (!user) {
      res.err = { message: "Nothing to delete. User not found" };
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.err = err;
    next();
  }
}, responseMiddleware);

export { router };
