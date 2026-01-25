import jwt from "jsonwebtoken"
import fs from "fs"

const publicKey = fs.readFileSync("../keys/access_public.pem")

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.sendStatus(401)

  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "auth.internal",
      audience: "microservices"
    })

    req.user = payload // contains sub (user id)
    next()
  } catch {
    res.sendStatus(401)
  }
}
