import mongoose from "mongoose"
import Ledger from "../model/Ledger.js"
import Account from "../model/User.js"
import { EVENTS } from "../events/checkout-events.js"
import { subscribe, publish } from "../events/rabbitmq.js"

export const startBankConsumer = async () => {

  await subscribe(
    "bank-payment",
    EVENTS.PROCESS_PAYMENT,
    async (data) => {

      // const session = await mongoose.startSession()
      // session.startTransaction()

      try {
        const { checkoutId, buyerId, items, totalAmount } = data

        // 🛑 Idempotency check
        const existing = await Ledger.findOne({
          referenceId: checkoutId,
          type: "DEBIT"
        })

        // if (existing) {
        //   await session.abortTransaction()
        //   session.endSession()
        //   return
        // }

        // 🔎 Get buyer account
        // const buyerAccount = await Account.findOne({ userId: buyerId }).session(session)
        const buyerAccount = await Account.findOne({ userId: buyerId })

        if (!buyerAccount || buyerAccount.balance < totalAmount) {
          throw new Error("INSUFFICIENT_FUNDS")
        }

        // 1️⃣ Debit buyer
        // buyerAccount.balance -= totalAmount
        // await buyerAccount.save({ session })

        await Ledger.create([{
          userId: buyerId,
          type: "DEBIT",
          amount: totalAmount,
          referenceType: "PURCHASE",
          referenceId: checkoutId
        }])
        // await Ledger.create([{
        //   userId: buyerId,
        //   type: "DEBIT",
        //   amount: totalAmount,
        //   referenceType: "CHECKOUT",
        //   referenceId: checkoutId
        // }], { session })


        // 2️⃣ Credit each seller
        for (const item of items) {

          const sellerAmount = item.price * item.quantity

          const sellerAccount = await Account.findOne({
            userId: item.sellerId
          })
          // const sellerAccount = await Account.findOne({
          //   userId: item.sellerId
          // }).session(session)

          if (!sellerAccount) {
            throw new Error("SELLER_ACCOUNT_NOT_FOUND")
          }

          // sellerAccount.balance += sellerAmount
          // await sellerAccount.save({ session })

          await Ledger.create([{
            userId: item.sellerId,
            type: "CREDIT",
            amount: sellerAmount,
            referenceType: "SELL",
            referenceId: checkoutId
          }])
          // await Ledger.create([{
          //   userId: item.sellerId,
          //   type: "CREDIT",
          //   amount: sellerAmount,
          //   referenceType: "CHECKOUT",
          //   referenceId: checkoutId
          // }], { session })
        }

        // ✅ Commit money movement
        // await session.commitTransaction()
        // session.endSession()
        console.log("Checkout was successfull!!!!")
        publish(EVENTS.PAYMENT_PROCESSED, {
          checkoutId,
          status: "SUCCESS"
        })

      } catch (err) {

        // await session.abortTransaction()
        // session.endSession()

        console.error("Payment failed:", err.message)
        console.log("Product validation failed!!!!!!!!!!!!");

        publish(EVENTS.PAYMENT_PROCESSED, {
          checkoutId: data.checkoutId,
          status: "FAILED"
        })
      }
    }
  )
}
