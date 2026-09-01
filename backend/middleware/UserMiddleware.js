import jwt from "jsonwebtoken";

const UserMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if(decoded.role!=="User"){
      return res.status(401).send({
        success:false,
        message:"You are not authorized to Enter the User Phase"
      })
    }
    req.id = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default UserMiddleware;