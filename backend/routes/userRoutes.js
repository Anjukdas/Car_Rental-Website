


import express from 'express';
import { protect ,admin} from '../middlewares/authMiddleware.js';
import { deleteUserById, getAllUsers, getUserById, loginUser, registerUser, updateUserById } from '../controllers/usersController.js';

const userRouter = express.Router();

// POST /users/register
userRouter.post("/register", registerUser);

export default userRouter;

// POST /users/login
userRouter.post("/login", loginUser);

userRouter.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Profile data",
    user: req.user, // { userId, role }
  });
});

userRouter.get("/all-users", protect, admin, getAllUsers);

// GET /users/:id
userRouter.get("/:id", protect, getUserById);

// PUT /users/:id
userRouter.put("/:id", protect, updateUserById);


// DELETE /users/:id
userRouter.delete("/:id", protect, deleteUserById);









