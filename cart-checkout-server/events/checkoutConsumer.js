import Checkout from "../models/checkout.js"
import { EVENTS } from "./checkout-events.js"
import { subscribe, publish } from "./rabbitmq.js"

export const startCheckoutConsumers = async () => {
  // Price validated
  await subscribe("checkout-price", EVENTS.PRICE_VALIDATED, async (data) => {
    await Checkout.updateOne(
      { checkoutId: data.checkoutId },
      { totalAmount: data.totalAmount }
    )
  })

  // Payment processed
  await subscribe("checkout-payment", EVENTS.PAYMENT_PROCESSED, async (data) => {
    if (data.status === "SUCCESS") {
      await Checkout.updateOne(
        { checkoutId: data.checkoutId },
        { status: "COMPLETED" }
      )

      publish(EVENTS.CHECKOUT_COMPLETED, data)
    } else {
      await Checkout.updateOne(
        { checkoutId: data.checkoutId },
        { status: "FAILED" }
      )

      publish(EVENTS.CHECKOUT_FAILED, data)
    }
  })
}
