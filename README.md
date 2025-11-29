Communication Aggregator Microservices System

1. Clone the Repository

git clone <github-repo-url>
cd <your-repo-folder>
Make sure the folder structure is like this:

/communication-aggregator
├── /task-router-service
├── /email-service
├── /sms-service
├── /whatsapp-service
├── /logging-service
├── docker-compose.yml
└── README.md

2. Install Dependencies for Each Microservice
Run the commands below from the root, but inside each folder:

Task Router Service
Bash

cd task-router-service
yarn install
Email Service
Bash

cd ../email-service
yarn install
SMS Service
Bash

cd ../sms-service
yarn install
WhatsApp Service
Bash

cd ../whatsapp-service
yarn install
Logging Service
Bash

cd ../logging-service
yarn install

3. Setup Databases (Prisma)
For each microservice that uses Prisma, run the migration command:

Task Router
Bash

cd task-router-service
npx prisma migrate dev
Email Service
Bash

cd ../email-service
npx prisma migrate dev
SMS Service
Bash

cd ../sms-service
npx prisma migrate dev
WhatsApp Service
Bash

cd ../whatsapp-service
npx prisma migrate dev
Note: Logging service doesn’t need DB migrations.

4. Start Kafka, Zookeeper, Elasticsearch, Kibana
Go to the project root:

Bash

cd ..
docker compose up -d
This starts the following services:

Kafka

Zookeeper

Elasticsearch

Kibana

Validation Checks
Check if services are running:

Bash

docker ps
Validate Kafka broker:

Bash

docker logs kafka
Validate Elasticsearch:

Visit:

http://localhost:9200

You should see an ES JSON response.

Validate Kibana:

http://localhost:5601

Kibana may take 1–2 minutes to boot.

5. Start All Microservices
Open 5 terminals (one per service).

1️⃣ Task Router
Bash

cd task-router-service
yarn start:dev
2️⃣ Email Service
Bash

cd email-service
yarn start:dev
3️⃣ SMS Service
Bash

cd sms-service
yarn start:dev
4️⃣ WhatsApp Service
Bash

cd whatsapp-service
yarn start:dev
5️⃣ Logging Service
Bash

cd logging-service
yarn start:dev

6. Test the System (Send a Request)
Send a POST request to the Task Router:

Endpoint
POST http://localhost:<task-router-port>/route
Sample Payload (Email)
JSON

{
"channel": "email",
"to": "user@example.com",
"subject": "Welcome!",
"body": "Your OTP is 1234"
}
Expected Behavior
Task Router publishes to send.email.

Email service consumes it.

Email service simulates email send.

Email service publishes logs to logs.delivery.email.

Logging service consumes logs and writes to Elasticsearch.

Kibana can display the logs under pattern logs.*.

7. Check Logs in Kibana
Open:

http://localhost:5601

Then follow these steps:

Go to Discover.

Create Index Pattern: logs.*.

Set time filter to Last 15 minutes.

You will see logs from:

Task Router

Email Service

SMS Service

WhatsApp Service

Logging Service

8. Test All Channels
SMS Example
JSON

{
"channel": "sms",
"to": "+1234567890",
"body": "Your code is 8899"
}
WhatsApp Example
JSON

{
"channel": "whatsapp",
"to": "+9876543210",
"body": "Hello from WhatsApp!"
}
Optional Cleanup
Stop all microservices:

Ctrl + C (in each terminal)
Stop all Docker services:

Bash

docker compose down
Environment Variables Configuration
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

Sample Email Request

Sample SMS Request

Sample WhatsApp Request

Default localhost URLs for Task Router Service
