import crypto from "crypto"
import User from "../modles/Users.js"

const handleResetPasswordViewLink = async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    })
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select("+passwordResetToken")

  if (!user) {
    return res.status(400).json({
      message: "Token is invalid or expired"
    })
  }

  // Set new password
  user.password = newPassword

  // Invalidate reset token & sessions
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  user.refreshToken = null

  await user.save()

  return res.json({
    message: "Password reset successful. Please login again."
  })
}


export {
    handleResetPasswordViewLink
}