import Checkout from "../models/checkout.js"
import { EVENTS } from "./checkout-events.js"
import { subscribe, publish } from "./rabbitmq.js"

export const startCheckoutConsumers = async () => {

  /*
   |--------------------------------------------------------------------------
   | 1️⃣ PRICE VALIDATED
   |--------------------------------------------------------------------------
   | Product service has validated products and attached:
   | - buyerId
   | - sellerId(s)
   | - price
   | - totalAmount
   |
   | Now Checkout must trigger payment step.
   */

  await subscribe(
    "checkout-price-validated",
    EVENTS.PRICE_VALIDATED,
    async (data) => {
      try {
        const { checkoutId, totalAmount } = data

        const checkout = await Checkout.findOne({ checkoutId })
        if (!checkout) return

        // 🛑 Idempotency: don't reprocess
        if (checkout.totalAmount) return

        // Update total amount
        checkout.totalAmount = totalAmount
        await checkout.save()

        // Trigger payment
        publish(EVENTS.PROCESS_PAYMENT, data)

      } catch (err) {
        console.error("PRICE_VALIDATED error:", err)
      }
    }
  )


  /*
   |--------------------------------------------------------------------------
   | 2️⃣ PRICE VALIDATION FAILED
   |--------------------------------------------------------------------------
   | Product service rejected products.
   | Immediately fail checkout.
   */

  await subscribe(
    "checkout-price-failed",
    EVENTS.PRICE_VALIDATION_FAILED,
    async (data) => {
      try {
        const { checkoutId } = data

        await Checkout.updateOne(
          { checkoutId },
          { status: "FAILED" }
        )

        publish(EVENTS.CHECKOUT_FAILED, { checkoutId })

      } catch (err) {
        console.error("PRICE_VALIDATION_FAILED error:", err)
      }
    }
  )


  /*
   |--------------------------------------------------------------------------
   | 3️⃣ PAYMENT PROCESSED
   |--------------------------------------------------------------------------
   | Bank completed debit + seller credit.
   */

  await subscribe(
    "checkout-payment",
    EVENTS.PAYMENT_PROCESSED,
    async (data) => {
      try {
        const { checkoutId, status } = data
        const checkout = await Checkout.findOne({ checkoutId })
        if (!checkout) return
        console.log("Payment success : ",checkout);
        // 🛑 Idempotency guard
        if (checkout.status === "COMPLETED" || checkout.status === "FAILED") {
          return
        }
        
        
        if (status === "SUCCESS") {
          
          checkout.status = "COMPLETED"
          await checkout.save()

          publish(EVENTS.CHECKOUT_COMPLETED, { checkoutId })

        } else {

          checkout.status = "FAILED"
          await checkout.save()

          publish(EVENTS.CHECKOUT_FAILED, { checkoutId })
        }

      } catch (err) {
        console.error("PAYMENT_PROCESSED error:", err)
      }
    }
  )
}
