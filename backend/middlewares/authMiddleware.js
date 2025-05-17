const {verifyToken} = require("../config/jwt.js");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // headers.authorization: Bearer ${token} so split(" ") then it returns array of
    // ['Bearer','${token}']
    // hence, [1] returns ${token}
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

module.exports = { protect };
