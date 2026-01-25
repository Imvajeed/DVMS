import jwt from "jsonwebtoken"
import fs from "fs"
import crypto from "crypto"

const privateKey = fs.readFileSync("../keys/access_private.pem")

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      permissions: user.permissions,
      email:user.email.toString()
    },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: "15m",
      issuer: "auth.internal",
      audience: "microservices",
      keyid: "access-key-2026"
    }
  )
}

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex")
}
