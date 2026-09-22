import jwt from "jsonwebtoken";

const UserMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;    
    if (!token) {
       return res.redirect(`${FRONTEND_URL}/Patient/Login`);
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if(decoded.role!=="User"){
        return res.redirect(`${FRONTEND_URL}/Patient/Login`);
    }
    req.id = decoded.id;
    next();
  } catch (error) {
     return res.redirect(`${FRONTEND_URL}/Patient/Login`);
  }
};

export default UserMiddleware;