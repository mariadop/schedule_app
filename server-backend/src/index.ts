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
      console.log("Admin utworzony: ", admin);
    }
  })
  .catch((err) => {
    console.error("Błąd połączenia z bazą:", err);
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

// Endpoint for logging in
app.post('/api/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    // 1. Szukamy użytkownika po loginie
    const user = await Family_member.findOne({ login });

    if (!user) {
      return res.status(401).json({ message: "Błędny login lub hasło!" });
    }

    // 2. Używamy Twojej metody z modelu do sprawdzenia hasła
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Błędny login lub hasło!" });
    }

    // 3. Jeśli wszystko ok, wysyłamy dane użytkownika do Frontendu
    res.json({
      message: "Zalogowano pomyślnie!",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        color: user.color
      }
    });

  } catch (error) {
    console.error("Błąd logowania:", error);
    res.status(500).json({ message: "Błąd serwera podczas logowania." });
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

// Endpoint to display the schedule of all family members in the calendar view
app.get('/api/family-status', async (req, res) => {
  try {

    const status = await Schedule.find()
      .populate('memberId', 'name color avatar')
      .sort({ day: 1 });

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas sprawdzania statusu rodziny." });
  }
});

// Endpoint to get the current status of family members based on the current time
app.get('/api/family-now', async (req, res) => {
  try {
    const teraz = new Date();
    
    const dni = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
    const dzisiejszyDzien = dni[teraz.getDay()];

    // 2. Pobieramy aktualną godzinę jako liczbę (np. 14:30 -> 1430)
    const aktualnaGodzina = teraz.getHours() * 100 + teraz.getMinutes();

    // 3. Szukamy w bazie zadania, które:
    // - jest dzisiaj
    // - zaczęło się przed lub teraz (startTime <= aktualnaGodzina)
    // - jeszcze się nie skończyło (endTime > aktualnaGodzina)
    const status = await Schedule.find({
      day: dzisiejszyDzien,
      time_start: { $lte: aktualnaGodzina },
      time_end: { $gt: aktualnaGodzina }
    }).populate('memberId', 'name color avatar');

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas pobierania aktualnego statusu." });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer http://localhost:${PORT}`);
})