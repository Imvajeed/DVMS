import crypto from "crypto"
import Checkout from "../models/checkout.js"
import { publish } from "../events/rabbitmq.js"
import { EVENTS } from "../events/checkout-events.js"

export const checkout = async (req, res) => {
  const userId = req.headers["x-user-id"]
  const { items } = req.body

  const checkoutId = crypto.randomUUID()

  await Checkout.create({
    checkoutId,
    userId,
    status: "PENDING"
  })

  publish(EVENTS.CHECKOUT_REQUESTED, {
    checkoutId,
    userId,
    items
  })

  res.json({ checkoutId, status: "PENDING" })
}
