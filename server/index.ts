import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { mergeSchemas } from '@graphql-tools/schema';
import cors from 'cors';
import jwt from 'jsonwebtoken';
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
    return next(); 
  }
};

app.use(authMiddleware);

// إنشاء schema موحدة
const mergedSchema = mergeSchemas({
  schemas: [loginSchema, taskSchema,homeSchema]
});

app.use('/graphql', graphqlHTTP((req) => ({
  schema: mergedSchema,
  graphiql: true,
  context: {
    user: (req as any).user 
  }
})));

// Test route
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// DB Connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));