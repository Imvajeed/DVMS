import { EVENTS } from "../events/checkout-events.js"
import { subscribe, publish } from "../events/rabbitmq.js"
import Product from "../models/Product.js"

export const startProductConsumer = async () => {
  await subscribe(
    "product-checkout",
    EVENTS.CHECKOUT_REQUESTED,
    async (data) => {
      try {
        let total = 0

        for (const item of data.items) {
          const product = await Product.findById(item.productId)

          if (!product || product.status !== "ACTIVE") {
            // ❌ Explicit failure event
            publish(EVENTS.PRICE_VALIDATION_FAILED, {
              checkoutId: data.checkoutId,
              reason: "PRODUCT_NOT_AVAILABLE",
              productId: item.productId
            })
            return
          }

          total += product.price * item.quantity
        }

        // ✅ Explicit success event
        publish(EVENTS.PRICE_VALIDATED, {
          checkoutId: data.checkoutId,
          totalAmount: total
        })
      } catch (err) {
        // ❌ System-level failure
        publish(EVENTS.PRICE_VALIDATION_FAILED, {
          checkoutId: data.checkoutId,
          reason: "INTERNAL_ERROR"
        })
      }
    }
  )
}
