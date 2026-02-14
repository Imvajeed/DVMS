import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// build correct absolute path inside docker container
const publicKeyPath = path.join(process.cwd(), "keys", "access_public.pem");

// read the public key
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "auth.internal",
      audience: "microservices",
    });

    req.user = payload; // user info (sub = user id)
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
