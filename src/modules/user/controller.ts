import {deleteOne} from "../../handlers/factor.js";
import catchAsyncError from "../../utils/catchAsyncError";
import {User} from "./model";
import httpStatus from "http-status";
import {userService} from "./service";

const createUser = catchAsyncError(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send({
        message: 'User created successfully',
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    });
});

const getAllUsers = catchAsyncError(async (req, res) => {
    const allUsers = await userService.getAllUsersService(req.query);
    const page = req.query.page || 1;
    res.status(200).json({page, message: "success", getAllUsers: allUsers});
});

const updateUser = catchAsyncError(async (req, res) => {
    const {id} = req.params;
    const updatedUser = await userService.updateUserService(id, req.body);
    res.status(200).json({message: "success", updateUser: updatedUser});
});

const changeUserPassword = catchAsyncError(async (req, res) => {
    const {id} = req.params;
    const updatedUser = await userService.changeUserPasswordService(id, req.body);
    res.status(200).json({message: "success", changeUserPassword: updatedUser});
});

const deleteUser = deleteOne(User, "user");

export {createUser, getAllUsers, updateUser, deleteUser, changeUserPassword};