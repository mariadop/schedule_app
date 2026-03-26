import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Family_member from './models/Family_member';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || '';

// Główna funkcja testowa logowania
const runTestLogin = async () => {
  const loginToTry = "Marysia";
  const passwordToTry = "haslo123";

  console.log("🔍 Próba testowego logowania...");
  const user = await Family_member.findOne({ login: loginToTry });

  if (!user) {
    console.log("❌ Nie ma takiego użytkownika w bazie!");
    return;
  }

  const isMatch = await user.comparePassword(passwordToTry);
  if (isMatch) {
    console.log(`✅ ZALOGOWANO! Witaj ${user.name} (${user.role})`);
  } else {
    console.log("❌ Błędne hasło!");
  }
};

// Połączenie z bazą
mongoose.connect(mongoUri)
  .then(async () => {
    console.log("✅ Sukces! Połączono z MongoDB Atlas");

    // 1. Sprawdzamy czy stworzyć admina
    const count = await Family_member.countDocuments();
    if (count === 0) {
      const admin = new Family_member({
        name: "Maria",
        role: "Administrator",
        login: "Marysia",
        password: "haslo123",
        color: "#114e16"
      });
      await admin.save();
      console.log("👤 Stworzono pierwszego członka rodziny!");
    }

    // 2. Odpalamy test logowania zaraz po upewnieniu się, że baza działa
    await runTestLogin();
  })
  .catch((err) => {
    console.error("❌ Błąd połączenia z bazą:", err);
  });

app.get('/', (req, res) => {
  res.send("Serwer działa i puka do bazy!");
});

app.listen(PORT, () => {
  console.log(`🚀 Serwer śmiga na http://localhost:${PORT}`);
});