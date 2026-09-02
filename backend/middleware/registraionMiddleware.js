import jwt from 'jsonwebtoken'

function authMiddleware(req,res,next){
 try {
    const token = req.params.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    req.id = decoded.id;
    if(decoded.role!=="Doctor"){
      return res.status(401).send({
        success:false,  
      message:"You are not authorized to Enter the Doctor Phase"
      })
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
}

export default authMiddleware;