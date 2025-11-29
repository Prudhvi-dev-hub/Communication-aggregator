import { Kafka } from 'kafkajs';
const { v4: UUID } = require('uuid');

async function run() {
  const kafka = new Kafka({
    clientId: 'publisher',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  });
  const producer = kafka.producer();
  await producer.connect();

  const payload = {
    requestId: UUID(),
    to: 'user@example.com',
    subject: 'Hello from test publisher',
    body: 'This is a test email from publisher',
  };

  await producer.send({
    topic: 'send.email',
    messages: [{ value: JSON.stringify(payload) }],
  });

  console.log('Published', payload);
  await producer.disconnect();
}

run().catch(console.error);
