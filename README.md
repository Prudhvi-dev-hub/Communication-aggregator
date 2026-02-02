# 📡 Communication Aggregator – Microservices System

A distributed system built using **NestJS + Kafka + Prisma + Elasticsearch + Kibana**, implementing message routing across Email, SMS, and WhatsApp delivery microservices.

# 🚀 1. Clone the Repository

```bash
git clone <github-repo-url>
cd <your-repo-folder>
```

### 📁 Folder Structure

```
/communication-aggregator
├── task-router-service
├── email-service
├── sms-service
├── whatsapp-service
├── logging-service
├── docker-compose.yml
└── README.md
```

---

# 📦 2. Install Dependencies (All Microservices)

Run the following inside each service folder:

### **Task Router Service**

```bash
cd task-router-service
yarn install
```

### **Email Service**

```bash
cd ../email-service
yarn install
```

### **SMS Service**

```bash
cd ../sms-service
yarn install
```

### **WhatsApp Service**

```bash
cd ../whatsapp-service
yarn install
```

### **Logging Service**

```bash
cd ../logging-service
yarn install
```

---

# 🗄️ 3. Setup Databases (Prisma Migrations)

### **Task Router**

```bash
cd task-router-service
npx prisma migrate dev
```

### **Email**

```bash
cd ../email-service
npx prisma migrate dev
```

### **SMS**

```bash
cd ../sms-service
npx prisma migrate dev
```

### **WhatsApp**

```bash
cd ../whatsapp-service
npx prisma migrate dev
```

> ⚠️ Logging service does **not** require migrations.

---

# 🐳 4. Start Kafka, Zookeeper, Elasticsearch, Kibana

From the **project root**:

```bash
docker compose up -d
```

This starts:

* Kafka
* Zookeeper
* Elasticsearch
* Kibana

### ✔ Validate Services

```bash
docker ps
```

### Check Kafka Logs

```bash
docker logs kafka
```

### Test Elasticsearch

Open in browser:

```
http://localhost:9200
```

### Test Kibana

```
http://localhost:5601
```

(Wait 1–2 minutes for Kibana to boot.)

---

# ▶️ 5. Start All Microservices

Use **separate terminals** for each service.

### 1️⃣ Task Router

```bash
cd task-router-service
yarn start:dev
```

### 2️⃣ Email Service

```bash
cd email-service
yarn start:dev
```

### 3️⃣ SMS Service

```bash
cd sms-service
yarn start:dev
```

### 4️⃣ WhatsApp Service

```bash
cd whatsapp-service
yarn start:dev
```

### 5️⃣ Logging Service

```bash
cd logging-service
yarn start:dev
```

---

# 📨 6. Test the System (Send Request)

Send a POST request to Task Router:

### **Endpoint**

```
POST http://localhost:3001/route
```

### Sample Email Payload

```json
{
  "channel": "email",
  "to": "user@example.com",
  "subject": "Welcome!",
  "body": "Your OTP is 1234"
}
```

### 🔄 Expected Flow

1. Task Router → publishes to `send.email`
2. Email Service → consumes & simulates delivery
3. Email Service → publishes logs to `logs.delivery.email`
4. Logging Service → consumes logs
5. Logs stored inside Elasticsearch
6. View logs in Kibana

---

# 📊 7. View Logs in Kibana

Visit:

```
http://localhost:5601
```

### Steps:

1. Go to **Discover**
2. Create index pattern:

```
logs.*
```

3. Set time filter → "Last 15 minutes"
4. Explore logs from:

   * Task Router
   * Email
   * SMS
   * WhatsApp
   * Logging Service

---

# 🧪 8. Test All Channels

### SMS Test

```json
{
  "channel": "sms",
  "to": "+1234567890",
  "body": "Your code is 8899"
}
```

### WhatsApp Test

```json
{
  "channel": "whatsapp",
  "to": "+9876543210",
  "body": "Hello from WhatsApp!"
}
```

---

# 🧹 Optional Cleanup

Stop microservices:

```
Ctrl + C
```

Stop Docker stack:

```bash
docker compose down
```

---

# 🔐 Environment Variables Required

Each service must contain a `.env` file.

### **task-router-service/.env**

```
PORT=3001
KAFKA_BROKERS=localhost:9092
```

### **email-service/.env**

```
PORT=3002
KAFKA_BROKERS=localhost:9092
```

### **sms-service/.env**

```
PORT=3003
KAFKA_BROKERS=localhost:9092
```

### **whatsapp-service/.env**

```
PORT=3004
KAFKA_BROKERS=localhost:9092
```

### **logging-service/.env**

```
PORT=3005
KAFKA_BROKERS=localhost:9092
```

---

# 📬 Postman Collection

Import the included file:

```
postman_collection.json
```

It includes:

* Email request
* SMS request
* WhatsApp request
* Ready-to-use Task Router API calls


# Failure Scenarios Considered

### 1. Email Service Down

If the email service is down, the email messages will not be delivered. The task router will not receive any response from the email service, and the logs will not be updated. The logs will be stored in the Elasticsearch cluster, and the logs will be available in the Kibana dashboard.

### 2. SMS Service Down

If the SMS service is down, the SMS messages will not be delivered. The task router will not receive any response from the SMS service, and the logs will not be updated. The logs will be stored in the Elasticsearch cluster, and the logs will be available in the Kibana dashboard.

### 3. WhatsApp Service Down

If the WhatsApp service is down, the WhatsApp messages will not be delivered. The task router will not receive any response from the WhatsApp service, and the logs will not be updated. The logs will be stored in the Elasticsearch cluster, and the logs will be available in the Kibana dashboard.

### 4. Logging Service Down

If the logging service is down, the logs will not be updated. The logs will be stored in the Elasticsearch cluster, and the logs will be available in the Kibana dashboard.
