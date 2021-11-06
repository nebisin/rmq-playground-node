const amqp = require("amqplib");
const data = require("./data.json");
const redis = require("redis");
const client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

const queueName = process.argv[2] || "jobsQueue";

connect_rabbitmq();

async function connect_rabbitmq() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);

    // accept the message
    console.log("waiting the messages");
    channel.consume(queueName, (msg) => {
      const messageInfo = JSON.parse(msg.content.toString());
      const userInfo = data.find((u) => (u.id = messageInfo.description));
      if (userInfo) {
        client.set(
          `user_${userInfo.id}`,
          JSON.stringify(userInfo),
          (err, reply) => {
            if (err) {
              console.log(err);
            } else {
              console.log(reply);
              channel.ack(msg);
            }
          }
        );
      }
    });
  } catch (error) {
    console.log("Error", error);
  }
}
