import crypto from "crypto"

export const createPasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  return {
    token,        // send via email
    hashedToken   // store in DB
  }
}
