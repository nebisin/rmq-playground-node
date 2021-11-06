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
    const assertion = await channel.assertQueue(queueName);

    // accept the message
    console.log("waiting the messages");
    channel.consume(queueName, (msg) => {
      const messageInfo = JSON.parse(msg.content.toString());
      const userInfo = data.find((u) => (u.id = messageInfo.description));
      if (userInfo) {
        console.log("User:", userInfo);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.log("Error", error);
  }
}
