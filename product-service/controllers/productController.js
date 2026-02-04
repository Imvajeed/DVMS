import Product from "../models/product.js";

/**
 * Seller adds a product
 */
const addProduct = async (req, res) => {
  const sellerId = req.headers["x-user-id"]
  const { name, description, price } = req.body

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price required" })
  }

  const product = await Product.create({
    name,
    description,
    price,
    sellerId
  })

  res.status(201).json(product)
}

/**
 * Buyer & Seller view all products
 */
const getAllProducts = async (req, res) => {
  const products = await Product.find({ status: "ACTIVE" })
    .sort({ createdAt: -1 })

  res.json(products)
}

/**
 * Seller updates own product
 */
const updateProduct = async (req, res) => {
  const sellerId = req.headers["x-user-id"]
  const { id } = req.params

  const product = await Product.findOne({
    _id: id,
    sellerId
  })

  if (!product) {
    return res.status(404).json({ message: "Product not found" })
  }

  Object.assign(product, req.body)
  await product.save()

  res.json(product)
}


export {
    addProduct,
    updateProduct,
    getAllProducts
}