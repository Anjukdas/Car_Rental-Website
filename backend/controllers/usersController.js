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

