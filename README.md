1. Clone the Repository
   git clone <github-repo-url>
   cd <your-repo-folder>

Make sure the folder structure is like:

/communication-aggregator
--/task-router-service
--/email-service
--/sms-service
--/whatsapp-service
--/logging-service
docker-compose.yml
README.md

2. Install Dependencies for Each Microservice

Run the commands below from the root, but inside each folder:

Task Router Service
cd task-router-service
yarn install

Email Service
cd ../email-service
yarn install

SMS Service
cd ../sms-service
yarn install

WhatsApp Service
cd ../whatsapp-service
yarn install

Logging Service
cd ../logging-service
yarn install

3. Setup Databases (Prisma)

For each microservice that uses Prisma, run:

Task Router
cd task-router-service
npx prisma migrate dev

Email Service
cd ../email-service
npx prisma migrate dev

SMS Service
cd ../sms-service
npx prisma migrate dev

WhatsApp Service
cd ../whatsapp-service
npx prisma migrate dev

Logging service doesn’t need DB migrations.

4. Start Kafka, Zookeeper, Elasticsearch, Kibana

Go to project root:

cd ..
docker compose up -d

This starts:

Kafka

Zookeeper

Elasticsearch

Kibana

Check if services are running
docker ps

Validate Kafka broker:
docker logs kafka

Validate Elasticsearch:

Visit:

http://localhost:9200

You should see ES JSON response.

Validate Kibana:

http://localhost:5601

Kibana may take 1–2 minutes to boot.

5. Start All Microservices

Open 5 terminals (one per service).

1️⃣ Task Router
cd task-router-service
yarn start:dev

2️⃣ Email Service
cd email-service
yarn start:dev

3️⃣ SMS Service
cd sms-service
yarn start:dev

4️⃣ WhatsApp Service
cd whatsapp-service
yarn start:dev

5️⃣ Logging Service
cd logging-service
yarn start:dev

6. Test the System (Send a Request)

Send POST request to Task Router:

Endpoint
POST http://localhost:<task-router-port>/route

Sample Payload
{
"channel": "email",
"to": "user@example.com",
"subject": "Welcome!",
"body": "Your OTP is 1234"
}

Expected Behavior

Task Router publishes to send.email

Email service consumes it

Email service simulates email send

Email service publishes logs to logs.delivery.email

Logging service consumes logs and writes to Elasticsearch

Kibana can display the logs under pattern logs.\*

7. Check Logs in Kibana

Open:

http://localhost:5601

Then:

Go to Discover

Create Index Pattern:

logs.\*

Set time filter to Last 15 minutes

You will see logs from:

Task Router

Email Service

SMS Service

WhatsApp Service

Logging Service

8. Test All Channels
   SMS Example
   {
   "channel": "sms",
   "to": "+1234567890",
   "body": "Your code is 8899"
   }

WhatsApp Example
{
"channel": "whatsapp",
"to": "+9876543210",
"body": "Hello from WhatsApp!"
}

Optional
Stop all microservices
Ctrl + C (in each terminal)

Stop all Docker services
docker compose down

Environment Variables

Before running the project, create .env files for each microservice using the templates below.

Each folder must contain its own .env file:

/task-router-service/.env
/email-service/.env
/sms-service/.env
/whatsapp-service/.env
/logging-service/.env

Copy the contents below into each file:

Task Router .env

PORT=3001
KAFKA_BROKERS=localhost:9092

Email Service .env

PORT=3002
KAFKA_BROKERS=localhost:9092

SMS Service .env
PORT=3003
KAFKA_BROKERS=localhost:9092

WhatsApp Service .env
PORT=3004
KAFKA_BROKERS=localhost:9092

Logging Service .env
PORT=3005
KAFKA_BROKERS=localhost:9092

Postman Collection

A Postman Collection is included to help you test the system easily.

Download or import the file:

"postman_collection.json"

It contains:

- Sample Email Request
- Sample SMS Request
- Sample WhatsApp Request
- Default localhost URLs for Task Router Service
