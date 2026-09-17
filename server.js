
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Note from './app/models/Note.js';
import User from './app/models/User.js';

const app = express();

const port = 5000;

const JWT_SECRET = 'secretkey';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. Please login."
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Token missing."
    });
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({
        message: "Invalid or expired token."
      });
    }

    req.user = user;
    next();
  });
}

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());

console.log("Connecting to database: Notesdb");

mongoose.connect("mongodb://localhost:27017/Notesdb")
  .then(() => {
    console.log("Connected to MongoDB Successfully!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required"
      });
    }

    const existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered"
      });
    }

    const lastUser = await User.findOne().sort({
      id: -1
    });

    let newId = 1;

    if (lastUser && Number.isFinite(Number(lastUser.id))) {
      newId = Number(lastUser.id) + 1;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      id: newId,
      username: username,
      email: email,
      password: hashedPassword
    });

    console.log("Registration successful:", email);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email
    });

    if (!user) {
      return res.status(401).json({
        message: "Email is not registered"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    console.log("Login successful:", email);

    res.status(200).json({
      message: "Login successful",
      token: token
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

app.get("/notes", authenticateToken, async (req, res) => {
  try {
    const result = await Note.find();
    res.json(result);
  } catch (error) {
    console.error("Error fetching notes:", error);

    res.status(500).json({
      message: "Error fetching notes",
      error: error.message
    });
  }
});

app.post("/notes", authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    const lastNote = await Note.findOne().sort({
      id: -1
    });

    let newId = 1;

    if (lastNote && Number.isFinite(Number(lastNote.id))) {
      newId = Number(lastNote.id) + 1;
    }

    const newNote = {
      id: newId,
      title: title,
      description: description
    };

    const savedNote = await Note.create(newNote);

    console.log("Note posted successfully:", savedNote);

    res.status(201).json({
      message: "Note posted successfully",
      note: savedNote
    });

  } catch (error) {
    console.error("Error posting note:", error);

    res.status(500).json({
      message: "Error posting note",
      error: error.message
    });
  }
});

app.delete("/note/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deletedNote = await Note.findOneAndDelete({
      id: id
    });

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json({
      message: "Note deleted successfully",
      note: deletedNote
    });

  } catch (error) {
    console.error("Error deleting note:", error);

    res.status(500).json({
      message: "Error deleting note",
      error: error.message
    });
  }
});

app.patch('/note/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { id: id },
      { title: title },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    res.json({
      message: `Note with id ${id} updated successfully`,
      note: updatedNote
    });

  } catch (error) {
    console.error("Error updating note:", error);

    res.status(500).json({
      message: "Error updating note",
      error: error.message
    });
  }
});

app.put('/note/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { id: id },
      {
        title: title,
        description: description
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    res.json({
      message: `Note with id ${id} updated successfully`,
      note: updatedNote
    });

  } catch (error) {
    console.error("Error updating note:", error);

    res.status(500).json({
      message: "Error updating note",
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

