import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// 1. Ładowanie zmiennych z pliku .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware (dodatki)
app.use(cors());
app.use(express.json()); // pozwala serwerowi rozumieć dane w formacie JSON

// 3. Połączenie z MongoDB
const mongoUri = process.env.MONGO_URI || '';

mongoose.connect(mongoUri)
  .then(() => {
    console.log("✅ Sukces! Połączono z MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ Błąd połączenia z bazą:", err);
  });

// 4. Prosty testowy adres (Endpoint)
app.get('/', (req, res) => {
  res.send("Serwer działa i puka do bazy!");
});

app.listen(PORT, () => {
  console.log(`🚀 Serwer śmiga na http://localhost:${PORT}`);
});