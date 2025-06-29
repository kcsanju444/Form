const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal server error");
  }
});

// POST: Create new user
router.post("/", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email || name.trim() === "" || email.trim() === "") {
    return res.status(400).send("All fields are required");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send("Internal server error");
  }
});

// PUT: Update user
router.put("/", async (req, res) => {
  const { id, name, email } = req.body;

  if (!id || !name || !email || id === "" || name === "" || email === "") {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User does not exist");
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal server error");
  }
});

// DELETE: Remove user
router.delete("/", async (req, res) => {
  const { id } = req.body;

  if (!id || id === "") {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User does not exist");
    }

    await user.remove();
    res.status(200).send(`User with id ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
