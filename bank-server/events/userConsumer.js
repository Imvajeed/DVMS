import { subscribe } from "../events/rabbitmq.js"
import { USER_EVENTS } from "../events/user-events.js"
import Account from "../model/User.js"
import Ledger from "../model/Ledger.js"

export const startUserConsumer = async () => {
  await subscribe(
    "bank-user-created",
    USER_EVENTS.USER_CREATED,
    async (event) => {
      const { userId, email } = event

      // 1️⃣ Idempotency check
      const exists = await Account.findOne({ userId })
      if (exists) return

      // 2️⃣ Create bank account
      await Account.create({ userId, email })

      // 3️⃣ Credit initial balance
      await Ledger.create({
        userId,
        type: "CREDIT",
        amount: Number(process.env.INITIAL_CREDIT || 1000),
        referenceType: "USER_CREATED"
      })
    }
  )
}
