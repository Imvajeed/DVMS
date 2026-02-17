import crypto from "crypto"
import Checkout from "../models/checkout.js"
import { publish } from "../events/rabbitmq.js"
import { EVENTS } from "../events/checkout-events.js"

export const checkout = async (req, res) => {
  const userId = req.headers["x-user-id"]
  const { items } = req.body

  let status = []





  for (const item of items) {
    const checkoutId = crypto.randomUUID()

    await Checkout.create({
      checkoutId,
      userId,
      status: "PENDING"
    })


    publish(EVENTS.CHECKOUT_REQUESTED, {
      checkoutId,
      buyerId: userId,
      item
    })

    status.push({ checkoutId, status: "PENDING" })

  }



  res.json(status)
}
