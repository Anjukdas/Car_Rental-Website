import User from "../models/Users.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateToken } from "../utils/generateToken.js"; 


dotenv.config();

export const registerUser = async (req, res) => {
    try {
        // check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // hash password
        const saltRounds = 10;
        const hash = await bcrypt.hash(req.body.password, saltRounds);

        // create user
        const userItem = {
            email: req.body.email,
            password: hash,
            role: req.body.role || "user",
        };

        const user = new User(userItem);
        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            userId: user.userId,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // generate token
    const token = generateToken(user.userId, user.role);

    res.status(200).json({
      message: "Login successful",
      userId: user.userId,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single user by userId
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // ID from URL

    const user = await User.findOne({ userId }).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only admin or the user themselves can access
    if (req.user.role !== "admin" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update user by userId
export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id; // ID from URL
    const updates = req.body;     // updated fields

    // Find user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only admin or the user themselves can update
    if (req.user.role !== "admin" && req.user.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update allowed fields 
    if (updates.email) user.email = updates.email;
    if (updates.role && req.user.role === "admin") user.role = updates.role; // only admin can change role
    if (updates.username) user.username = updates.username;
    if (updates.name) user.name = updates.name;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user by userId
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only admin or the user themselves can delete
    if (req.user.role !== "admin" && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Use deleteOne instead 
    await User.deleteOne({ userId: req.params.id });

    res.status(200).json({ message: `User with ID ${req.params.id} has been deleted.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
