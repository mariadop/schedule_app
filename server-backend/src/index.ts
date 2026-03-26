import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Family_member from './models/Family_member';
import Schedule from './models/Schedule';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || '';

//connection to the database
mongoose.connect(mongoUri)
  .then(async () => {
    console.log("✅ Sukces! Połączono z MongoDB Atlas");

    // is it necessary to create an admin?
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
      console.log("Stworzono pierwszego członka rodziny!");
    }
  })
  .catch((err) => {
    console.error("Błąd połączenia z bazą:", err);
  });

app.get('/', (req, res) => {
  res.send("Serwer działa!");
});

// creating new member endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, role, login, password, color } = req.body;

    //check if the login is already taken
    const existingUser = await Family_member.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ message: "Ten login jest już zajęty!" });
    }

    // new family member creation
    const newUser = new Family_member({
      name,
      role,
      login,
      password,
      color
    });

    await newUser.save();

    //response to the frontend with the new user data
    res.status(201).json({ 
      message: "Konto stworzone pomyślnie!",
      user: { name: newUser.name, role: newUser.role } 
    });

  } catch (error) {
    console.error("Błąd rejestracji:", error);
    res.status(500).json({ message: "Błąd serwera podczas rejestracji." });
  }
});

//endpoint for creating a new task in the calendar
app.post('/api/schedule', async (req, res) => {
  try {
    const { memberId, day, time_start, time_end, task } = req.body;

    const newTask = new Schedule({
      memberId,
      day,
      time_start,
      time_end,
      task
    });

    await newTask.save();
    res.status(201).json({ message: "Zadanie dodane do kalendarza!", newTask });
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas dodawania zadania." });
  }
});

// Endpoint to get tasks for a specific family member
app.get('/api/schedule/:memberId', async (req, res) => {
  try {
    const tasks = await Schedule.find({ memberId: req.params.memberId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas pobierania kalendarza." });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer http://localhost:${PORT}`);
})