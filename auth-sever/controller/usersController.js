import User from '../modles/Users.js'
import { generateAccessToken, generateRefreshToken } from './tokens.js';
import fs from "fs"
import crypto from "crypto"


const publicKey = fs.readFileSync("../keys/access_public.pem")
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const handleRegisterUser = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // 1. Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            })
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        // 3. Create user
        const user = await User.create({
            username,
            email,
            password
        })

        // 4. Response (never send password)
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Register error:", error)

        return res.status(500).json({
            message: "Server error"
        })
    }

}


const handleLoginUser = async (req, res) => {

    
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "All fields required" })
    }

    const user = await User.findOne({ email })
        .select("+password +refreshToken")

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    // 1. Generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken()

    // 2. Store HASHED refresh token
    user.refreshToken = hashToken(refreshToken)
    user.lastLoginAt = new Date()
    await user.save()

    // 3. Send refresh token as cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({ accessToken })

}

const handleRefreshController = async (req, res)=>{
    const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.sendStatus(401)

  const hashed = hashToken(refreshToken)

  const user = await User.findOne({ refreshToken: hashed })
  if (!user) return res.sendStatus(403)

  // ROTATE refresh token
  const newRefreshToken = generateRefreshToken()
  user.refreshToken = hashToken(newRefreshToken)
  await user.save()

  const newAccessToken = generateAccessToken(user)

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  return res.json({ accessToken: newAccessToken })
}




export {
    handleRegisterUser,
    handleLoginUser,
    handleRefreshController
}