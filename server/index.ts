import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { mergeSchemas } from '@graphql-tools/schema';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { server as WebSocketServer, connection as WebSocketConnection } from 'websocket';
import http from 'http';

import loginSchema from './GraphQl/LoginAPI.js';
import taskSchema from './GraphQl/TaskAPI.js';
import homeSchema from './GraphQl/HomeAPI.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error('Invalid token:', err);
    next();
  }
};

app.use(authMiddleware);

const mergedSchema = mergeSchemas({
  schemas: [loginSchema, taskSchema, homeSchema],
});

app.use('/graphql', graphqlHTTP((req) => ({
  schema: mergedSchema,
  graphiql: true,
  context: {
    user: (req as any).user
  }
})));

app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

const server = http.createServer(app);

const connectedUsers: { [key: string]: WebSocketConnection } = {};

const wsServer = new WebSocketServer({
  httpServer: server,
});

const generateID = () => "id" + Math.random().toString(16).slice(2);

wsServer.on("request", function (request) {
  const id = generateID();
  console.log("Connection request from " + request.origin + ".");

  const connection = request.accept(null, request.origin);
  connectedUsers[id] = connection;

  console.log(
    "Connection established: " +
      id +
      " in " +
      Object.keys(connectedUsers)
  );

  connection.on("message", function (message) {
    if (message.type === 'utf8') {
      console.log("Received Message: ", message.utf8Data);
      for (const userId in connectedUsers) {
        connectedUsers[userId].sendUTF(message.utf8Data);
      }
    }
  });

  connection.on("close", () => {
    console.log("Connection closed: ", id);
    delete connectedUsers[id];
  });
});

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🛰 WebSocket server running on ws://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
