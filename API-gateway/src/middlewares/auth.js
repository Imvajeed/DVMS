import jwt from "jsonwebtoken"
import fs from "fs"

const publicKey = fs.readFileSync("../keys/access_public.pem")

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.sendStatus(401)

  const token = authHeader.split(" ")[1]

  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "auth.internal",
      audience: "microservices"
    })

    // Attach user context
    req.user = {
      id: payload.sub,
      role: payload.role,
      permissions: payload.permissions
    }

    next()
  } catch (err) {
    return res.sendStatus(401)
  }
}
