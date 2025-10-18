import catchAsyncError from "../utils/catchAsyncError";
import AppError from "../utils/AppError";
import httpStatus from "http-status";

export const deleteOne = (model, name) => {
  return catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id, {
      new: true,
    });

    let response = {};
    response[name] = document;
    loger.info(response);
    loger.info({ ...response });
    loger.info(name);
    document && res.status(201).json({ message: "success", ...response });

    !document && next(new AppError(httpStatus.NOT_FOUND, `${name} was not found`, ));
  });
};
