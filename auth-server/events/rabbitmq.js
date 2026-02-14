import amqp from "amqplib"

let channel

export const connectRabbitMQ = async () => {
  const conn = await amqp.connect(process.env.RABBITMQ_URL)
  channel = await conn.createChannel()
  await channel.assertExchange("checkout", "topic", { durable: true })
}

export const publish = (routingKey, data) => {
  channel.publish(
    "checkout",
    routingKey,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  )
}

export const subscribe = async (queue, routingKey, handler) => {
  await channel.assertQueue(queue, { durable: true })
  await channel.bindQueue(queue, "checkout", routingKey)

  channel.consume(queue, async (msg) => {
    const data = JSON.parse(msg.content.toString())
    await handler(data)
    channel.ack(msg)
  })
}
