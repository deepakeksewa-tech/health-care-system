import jwt from "jsonwebtoken";

const DoctorMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;    
    if (!token) {
      return res.redirect(`${FRONTEND_URL}/login`);
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if(decoded.role!=="Doctor"){
       return res.redirect(`${FRONTEND_URL}/login`);
    }
    req.id = decoded.id;
 
    

    next();
  } catch (error) {
      return res.redirect(`${FRONTEND_URL}/login`);
  }
};

export default DoctorMiddleware;