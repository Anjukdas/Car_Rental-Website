


import express from 'express';
import { protect ,admin} from '../middlewares/authMiddleware.js';
import { getAllUsers, loginUser, registerUser } from '../controllers/usersController.js';

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

// // Get all users
// // GET /getUsers
// userRouter.get("/",getUsers);

// // Get single user by ID
// // GET /users/:id
// userRouter.get("/:id",getUserById);

// // Update user by ID
// // PUT /users/:id
// userRouter.put("/:id",updateUserById);

// // Delete user by ID
// // DELETE /users/:id
// userRouter.delete("/:id",deleteUserById);





