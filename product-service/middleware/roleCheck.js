export const requireSeller = (req, res, next) => {
  const role = req.headers["x-user-role"]

  if (role !== "seller") {
    return res.status(403).json({
      message: "Only sellers can perform this action"
    })
  }

  next()
}
