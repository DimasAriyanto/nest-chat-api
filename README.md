# NestJS Real-Time Chat Application

## Overview
A robust real-time chat application built with:
- NestJS (Backend Framework)
- MongoDB (Database)
- Redis (Caching & Session Management)
- RabbitMQ (Message Queuing)
- Socket.IO (Real-Time Communication)

## Technology Stack
- Backend: NestJS with TypeScript
- Database: MongoDB
- Caching: Redis
- Message Broker: RabbitMQ
- Real-Time Communication: Socket.IO
- ORM/ODM: Mongoose
- Authentication: JWT

## Project Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB
- Redis
- RabbitMQ

### Installation
```bash
# Install dependencies
$ npm install

# Create .env file based on .env.example
$ cp .env.example .env
```

## Running the Application

```bash
# Development mode
$ npm run start

# Watch mode (with auto-reload)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Testing

### Unit Tests
```bash
# Run unit tests
$ npm run test

# Run test coverage
$ npm run test:cov
```

### E2E Tests
```bash
# Run end-to-end tests
$ npm run test:e2e
```

## WebSocket Testing

### Browser-Based Testing
1. Start the application
2. Open `views/socket-test.html` in a web browser
3. Use the dual-user interface to test real-time messaging
4. Enter valid JWT tokens for authentication

### Postman API Documentation
Comprehensive API documentation available at:
https://documenter.getpostman.com/view/22351148/2sAYkKKJSP