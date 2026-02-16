import Product from "../models/Product.js"
import { EVENTS } from "../events/checkout-events.js"
import { subscribe, publish } from "../events/rabbitmq.js"

export const startProductConsumer = async () => {

  await subscribe(
    "product-checkout",
    EVENTS.CHECKOUT_REQUESTED,
    async (data) => {
      try {
        const { checkoutId, buyerId, items } = data

        

        let totalAmount = 0
        const enrichedItems = []

        for (const item of items) {

          const product = await Product.findById(item.productId)
          console.log("Products sent for validation : ", product);

          // ❌ Product not found
          if (!product) {
            console.log("Product validation failed!!!!!!!!!!!!");
            publish(EVENTS.PRICE_VALIDATION_FAILED, {
              checkoutId,
              reason: "PRODUCT_NOT_FOUND"
            })
            return
          }

          // ❌ Not enough stock
          // if (product.stock < item.quantity) {
          //   publish(EVENTS.PRICE_VALIDATION_FAILED, {
          //     checkoutId,
          //     reason: "INSUFFICIENT_STOCK"
          //   })
          //   return
          // }

          const itemTotal = product.price * item.quantity
          totalAmount += itemTotal

          enrichedItems.push({
            productId: product._id,
            sellerId: product.sellerId,
            price: product.price,
            quantity: item.quantity
          })
        }


        // ✅ Emit enriched event
        publish(EVENTS.PRICE_VALIDATED, {
          checkoutId,
          buyerId,
          items: enrichedItems,
          totalAmount
        })
        return

      } catch (err) {
        console.error("CHECKOUT_REQUESTED error:", err)

        publish(EVENTS.PRICE_VALIDATION_FAILED, {
          checkoutId: data.checkoutId,
          reason: "INTERNAL_ERROR"
        })
      }
    }
  )
}
