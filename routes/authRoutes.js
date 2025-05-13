import { Router } from "express";
import { authService } from "../services/authService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

router.post(
  "/login",
    ctrlWrapper(
    (req, res, _) => {
            res.data = authService.login(req.body);
        }
    ),
    responseMiddleware
);

export { router };
