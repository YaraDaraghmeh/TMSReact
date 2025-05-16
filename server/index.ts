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

// JWT Authentication Middleware
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

// Merge GraphQL Schemas
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

// WebSocket Setup
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

// WebSocket Logic
wsServer.on("request", function (request: WebSocketRequest) {
  const id = generateID();
  const connection = request.accept(null, request.origin);
  connectedUsers[id] = { id, connection };

  console.log(`✅ WebSocket connected: ${id}`);

  // Broadcast online users to all
  function broadcastOnlineUsers() {
    const onlineUserIds = Object.values(connectedUsers)
      .map((u) => u.userId)
      .filter(Boolean);

    const payload = JSON.stringify({
      type: 'onlineUsers',
      users: onlineUserIds,
    });

    Object.values(connectedUsers).forEach(({ connection }) => {
      connection.sendUTF(payload);
    });
  }

  connection.on("message", function (message) {
  if (message.type === 'utf8') {
    try {
      const data = JSON.parse(message.utf8Data || '{}');

      // ✅ تسجيل userId عند الانضمام
      if (data.type === 'join' && data.userId) {
        connectedUsers[id].userId = data.userId;
        broadcastOnlineUsers();
        return;
      }

      // ✅ احتياطي: تسجيل userId عند إرسال أول رسالة
      if (data.fromUserId && !connectedUsers[id].userId) {
        connectedUsers[id].userId = data.fromUserId;
        broadcastOnlineUsers();
      }

      // ✅ إرسال رسالة مع الوقت
      if (data.type === "message") {
        const { fromUserId, targetUserId, userName, message: msg, id: messageId } = data;

        const payload = JSON.stringify({
          type: "message",
          id: messageId,
          userName,
          message: msg,
          fromUserId,
          targetUserId,
          time: new Date().toISOString(), // ⏰ أضف الوقت هنا
        });

        Object.values(connectedUsers).forEach(({ connection, userId }) => {
          if (!targetUserId || targetUserId === userId || fromUserId === userId) {
            connection.sendUTF(payload);
          }
        });
      }

      // ✅ مؤشر الكتابة
      else if (data.type === "typing") {
        const { fromUserId, targetUserId, userName } = data;

        Object.values(connectedUsers).forEach(({ connection, userId }) => {
          if (userId !== fromUserId && (!targetUserId || userId === targetUserId)) {
            connection.sendUTF(JSON.stringify({
              type: "typing",
              userName,
              fromUserId,
              targetUserId,
            }));
          }
        });
      }

      // ✅ إشعار القراءة
      else if (data.type === 'read') {
        const receiver = Object.values(connectedUsers).find(u => u.userId === data.toUserId);
        if (receiver) {
          receiver.connection.sendUTF(JSON.stringify({
            type: 'read',
            messageId: data.messageId,
          }));
        }
      }

    } catch (err) {
      console.error("❌ Failed to process message:", err);
    }
  }
});


  connection.on("close", () => {
    console.log("🔌 WebSocket closed:", id);
    delete connectedUsers[id];
    broadcastOnlineUsers();
  });
});

// MongoDB + Start Server
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🛰 WebSocket server running on ws://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
