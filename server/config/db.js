import dns from 'dns';
import mongoose from 'mongoose';

// Force Google DNS to bypass local DNS issues with MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

let connecting = false;

// Connect to MongoDB with retry. This never exits the process — a database
// hiccup (or a missing MONGODB_URI during local setup) must not take the API
// server down, otherwise the dev proxy reports a confusing 502 on every
// request. The server stays up and individual routes surface clear errors
// until the connection is established.
export default async function connectDB({ retryDelayMs = 5000 } = {}) {
  if (connecting || mongoose.connection.readyState === 1) return;
  connecting = true;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MongoDB: MONGODB_URI is not set. Create server/.env from server/.env.example. Retrying in background…');
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    connecting = false;
  } catch (err) {
    connecting = false;
    console.error(`MongoDB connection error: ${err.message}. Retrying in ${Math.round(retryDelayMs / 1000)}s…`);
    setTimeout(() => connectDB({ retryDelayMs }), retryDelayMs);
  }
}
