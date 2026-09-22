import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  const loginUrl = `${process.env.FRONTEND_URL || ""}/Admin/LoginPage`;

  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.redirect(loginUrl);
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    if (decoded.role !== "Admin") {
      return res.redirect(loginUrl);
    }

    req.user = decoded;
    req.id = decoded.id;

    next();
  } catch (error) {
    return res.redirect(loginUrl);
  }
};

export default adminMiddleware;