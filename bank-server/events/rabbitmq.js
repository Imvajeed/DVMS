import amqp from "amqplib";

let channel, connection;

export const connectRabbitMQ = async () => {
  try {
    const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

    connection = await amqp.connect(url);
    channel = await connection.createChannel();

    console.log("✅ Connected to RabbitMQ");

    await channel.assertQueue("bank-queue", {
      durable: true,
    });

  } catch (err) {
    console.log("❌ RabbitMQ not ready, retrying in 5 seconds...");
    setTimeout(connectRabbitMQ, 5000);
  }
};

export const getChannel = () => channel;
