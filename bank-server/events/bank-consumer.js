import { EVENTS } from "../events/checkout-events.js"
import { subscribe, publish } from "../events/rabbitmq.js"
import { debitUser } from "../ledger/debit.js"

export const startBankConsumer = async () => {
  await subscribe("bank-checkout", EVENTS.PRICE_VALIDATED, async (data) => {
    try {
      await debitUser(data.checkoutId, data.totalAmount)

      publish(EVENTS.PAYMENT_PROCESSED, {
        checkoutId: data.checkoutId,
        status: "SUCCESS"
      })
    } catch {
      publish(EVENTS.PAYMENT_PROCESSED, {
        checkoutId: data.checkoutId,
        status: "FAILED"
      })
    }
  })
}
