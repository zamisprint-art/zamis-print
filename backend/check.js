import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const sourceURI = process.env.MONGODB_URI; 
const testDbURI = sourceURI.replace(/\/\?/, '/zamis-test?');
const prodDbURI = sourceURI.replace(/\/\?/, '/zamis-prod?');

const check = async () => {
  const prodConnection = await mongoose.createConnection(prodDbURI).asPromise();
  const prodDb = prodConnection.client.db('zamis-prod');
  const prodProducts = await prodDb.collection('products').countDocuments();
  console.log('Productos en zamis-prod:', prodProducts);
  await prodConnection.close();

  const testConnection = await mongoose.createConnection(testDbURI).asPromise();
  const testDb = testConnection.client.db('zamis-test');
  const testProducts = await testDb.collection('products').countDocuments();
  console.log('Productos en zamis-test:', testProducts);
  await testConnection.close();
  
  process.exit(0);
};

check();
