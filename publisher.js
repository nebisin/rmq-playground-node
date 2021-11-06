const amqp = require("amqplib");
const data = require("./data.json");

const queueName = process.argv[2] || "jobsQueue";

const message = {
  description: "this is a test message",
};

connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);

    data.forEach((i) => {
      message.description = i.id;
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Message that send", message);
    });

    /* Interval to send messages
    setInterval(() => {
      message.description = new Date().getTime();
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Message that send", message);
    }, 500);
    Interval to send messages */
  } catch (error) {
    console.log("Error", error);
  }
}
