import authService from "../services/auth.service.js";
import ApiError from "../utils/apiError.js";

const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.IS_PROD_BUILD || false, // set to true in production
      sameSite: "Lax",
    });

    res.redirect("http://localhost:5173");
    res.json({ user });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

export default { login };
