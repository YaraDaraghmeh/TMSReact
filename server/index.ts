import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/index.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// GraphQL Endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

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