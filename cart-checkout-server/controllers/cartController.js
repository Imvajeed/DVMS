import Cart from "../models/Cart.js"

export const addToCart = async (req, res) => {
  const userId = req.headers["x-user-id"]
  const { productId, quantity } = req.body

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Invalid input" })
  }

  let cart = await Cart.findOne({ userId })

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity }]
    })
  } else {
    const item = cart.items.find(i => i.productId === productId)
    if (item) {
      item.quantity += quantity
    } else {
      cart.items.push({ productId, quantity })
    }
    await cart.save()
  }

  res.json(cart)
}

export const getCart = async (req, res) => {
  const userId = req.headers["x-user-id"]
  const cart = await Cart.findOne({ userId })
  res.json(cart || { items: [] })
}

export const clearCart = async (userId) => {
  await Cart.deleteOne({ userId })
}
