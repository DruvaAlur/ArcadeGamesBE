import * as authService from "../services/auth.service.js";
import { ApiError } from "../utils/apiError.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await authService.loginUser(req.body);
    res.json({ token });
  } catch (err) {
    next(new ApiError(401, "Invalid credentials"));
  }
};
