import express from "express";
import * as userController from "./controller";
import validate from "../../validators/validate";
import {
    createUserValidation,
    changeUserPasswordValidation,
    deleteUserValidation,
    updateUserValidation,
} from "./validation";
import {authenticateJWT} from "../../middlewares/jwt";

const userRouter = express.Router();
userRouter.use(authenticateJWT)
userRouter
    .route("/")
    .post(validate({body: createUserValidation}), userController.createUser)
    .get(userController.getAllUsers);

userRouter
    .route("/:id")
    .patch(validate({body: updateUserValidation}), userController.updateUser)
    .delete(validate({body: deleteUserValidation}), userController.deleteUser)
    .patch(validate({body: changeUserPasswordValidation}), userController.changeUserPassword);

export default userRouter;
