// server/middleware/userAuth.js
import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res.json({ success: false, message: "Not Authorized. Login again" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;
