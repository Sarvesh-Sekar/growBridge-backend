import * as express from "express";
import { authentification } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.Controller";
import { authorization } from "../middlewares/auth.middleware";
import { AuthController } from "../controllers/Auth.Controller";

const router = express.Router();

router.get(
  "/users",
  authentification,
  authorization(["admin"]),
  UserController.getUsers
);
router.get(
  "/profile",
  authentification,
  authorization(["admin", "user"]),
  AuthController?.getProfile
);
router.post("/signup", UserController?.signup);
router.post("/login", AuthController?.login);
router.put(
  "/update/:id",
  authentification,
  authorization(["user", "admin"]),
  UserController.updateUser
);
router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  UserController.deleteUser
);
export { router as userRouter };
