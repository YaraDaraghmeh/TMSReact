import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { mergeSchemas } from '@graphql-tools/schema';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { server as WebSocketServer, connection as WebSocketConnection, request as WebSocketRequest } from 'websocket';
import http from 'http';

import loginSchema from './GraphQl/LoginAPI.js';
import taskSchema from './GraphQl/TaskAPI.js';
import homeSchema from './GraphQl/HomeAPI.js';
import userSchema from './GraphQl/UserAPI.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
  } catch (err) {
    console.error('Invalid token:', err);
  }
  next();
};
app.use(authMiddleware);

const mergedSchema = mergeSchemas({
  schemas: [loginSchema, taskSchema, homeSchema, userSchema],
});

app.use('/graphql', graphqlHTTP((req) => ({
  schema: mergedSchema,
  graphiql: true,
  context: { user: (req as any).user }
})));

app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

const server = http.createServer(app);

interface ConnectedUser {
  id: string;
  connection: WebSocketConnection;
  userId?: string; 
}

const connectedUsers: { [id: string]: ConnectedUser } = {};

const wsServer = new WebSocketServer({
  httpServer: server,
});

const generateID = () => "id" + Math.random().toString(16).slice(2);

wsServer.on("request", function (request: WebSocketRequest) {
  const id = generateID();
  console.log("Connection request from " + request.origin + ".");

  const connection = request.accept(null, request.origin);

  connectedUsers[id] = { id, connection };

  console.log(`Connection established: ${id} | Total: ${Object.keys(connectedUsers).length}`);

  connection.on("message", function (message) {
    if (message.type === 'utf8') {
      try {
        const data = JSON.parse(message.utf8Data || '{}');

        if (data.type === "message") {
          const fromUserId = data.fromUserId;
          const targetUserId = data.targetUserId; 
          Object.values(connectedUsers).forEach(({ connection, userId }) => {
            
            if (!targetUserId || targetUserId === userId) {
              connection.sendUTF(JSON.stringify({
                userName: data.userName,
                message: data.message,
                fromUserId,
                targetUserId
              }));
            }
          });
        }
      } catch (err) {
        console.error("Failed to process message:", err);
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
