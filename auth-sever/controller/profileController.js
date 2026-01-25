import User from "../modles/Users.js"
import { createPasswordResetToken } from "./passwordResetToken.js"

const handlePasswordChange = async (req , res)=>{
    try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required"
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters"
      })
    }

    // 1. Get user with password
    const user = await User.findById(req.user.sub)
      .select("+password +refreshToken")

    if (!user) {
      return res.sendStatus(404)
    }

    // 2. Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect"
      })
    }

    // 3. Set new password
    user.password = newPassword

    // 4. Invalidate all sessions (VERY IMPORTANT)
    user.refreshToken = null

    await user.save()

    return res.json({
      message: "Password changed successfully. Please log in again."
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const handleForgotPassword = async (req, res)=>{
    const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  const user = await User.findOne({ email })
  if (!user) {
    // IMPORTANT: do NOT reveal user existence
    return res.json({
      message: "If the email exists, a reset link will be sent"
    })
  }

  const { token, hashedToken } = createPasswordResetToken()

  user.passwordResetToken = hashedToken
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000 // 15 minutes
  await user.save()

  const resetUrl = `http://localhost:4000/reset-password/reset-link/${token}`
  console.log(resetUrl);

  // Example email content
  /*
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html: `
      <p>Click the link to reset password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `
  })
  */

  return res.json({
    message: "If the email exists, a reset link will be sent"
  })
}



export {
    handlePasswordChange,
    handleForgotPassword
}